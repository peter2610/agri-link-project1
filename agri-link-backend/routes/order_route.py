# agri-link-backend/routes/order_route.py

from flask import request
from flask_restful import Resource
from config import db
from sqlalchemy.exc import SQLAlchemyError
from models.order import Order
from models.offer import Offer
from models.farmer import Farmer

class OrderListResource(Resource):
    def get(self):
        """Get all orders with optional filtering"""
  
        try:
            # Get query parameters
            farmer_id = request.args.get('farmer_id', type=int)
            status = request.args.get('status')
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            sort_by = request.args.get('sort_by', 'created_at')
            order = request.args.get('order', 'desc')
            
            # Build query
            query = Order.query
            
            if farmer_id:
                query = query.filter(Order.farmer_id == farmer_id)
            
            if status:
                query = query.filter_by(status=status)
            
            # Apply sorting
            sort_attr = getattr(Order, sort_by, None)
            if sort_attr is None:
                sort_attr = Order.created_at

            if order == 'asc':
                query = query.order_by(sort_attr.asc())
            else:
                query = query.order_by(sort_attr.desc())
            
            # Paginate results
            paginated = query.paginate(page=page, per_page=per_page, error_out=False)
            
            # Serialize orders
            orders = []
            for order_item in paginated.items:
                order_dict = order_item.to_dict()

                farmer = None
                if order_dict.get('farmer_id'):
                    farmer = Farmer.query.get(order_dict['farmer_id'])

                if farmer:
                    order_dict['farmer'] = {
                        'id': farmer.id,
                        'full_name': farmer.full_name,
                        'location': farmer.location,
                        'phone_number': farmer.phone_number,
                    }

                buyer = order_item.buyer
                if buyer:
                    order_dict['buyer'] = {
                        'id': buyer.id,
                        'full_name': buyer.full_name,
                        'location': buyer.location,
                        'phone_number': buyer.phone_number,
                    }

                orders.append(order_dict)
            
            return {
                'orders': orders,
                'pagination': {
                    'page': paginated.page,
                    'per_page': paginated.per_page,
                    'total': paginated.total,
                    'pages': paginated.pages,
                    'has_prev': paginated.has_prev,
                    'has_next': paginated.has_next
                }
            }, 200
            
        except SQLAlchemyError as e:
            return {"error": str(e)}, 500
        except Exception as e:
            return {"error": str(e)}, 500
    
    def post(self):
        """Create a new order"""
        try:
            data = request.get_json() or {}

            required_fields = ['buyer_id', 'offer_id', 'quantity']
            for field in required_fields:
                if field not in data:
                    return {"error": f"Missing required field: {field}"}, 400

            offer = Offer.query.get(data['offer_id'])
            if not offer:
                return {"error": "Offer not found"}, 404

            total_price = data.get('total_price')
            if total_price is None:
                # fall back to offer price * quantity when available
                offer_price = offer.price or 0
                total_price = float(data['quantity']) * float(offer_price)

            order = Order(
                buyer_id=data['buyer_id'],
                offer_id=data['offer_id'],
                quantity=data['quantity'],
                total_price=total_price,
                status=data.get('status', 'pending'),
            )

            db.session.add(order)
            db.session.commit()

            return order.to_dict(), 201

        except SQLAlchemyError as e:
            db.session.rollback()
            return {"error": str(e)}, 500
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

class OrderDetailResource(Resource):
    def get(self, order_id):
        """Get a specific order"""
        try:
            order = Order.query.get(order_id)
            if not order:
                return {"error": "Order not found"}, 404
            
            order_dict = order.to_dict()
            # Add farmer info
            farmer = Farmer.query.get(order.farmer_id) if order.farmer_id else None
            if farmer:
                order_dict['farmer'] = {
                    'id': farmer.id,
                    'full_name': farmer.full_name,
                    'email': farmer.email,
                    'phone_number': farmer.phone_number,
                    'location': farmer.location
                }
            
            return order_dict, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
    
    def put(self, order_id):
        """Update an order"""
        try:
            order = Order.query.get(order_id)
            if not order:
                return {"error": "Order not found"}, 404
            
            data = request.get_json()
            
            # Update fields
            if 'crop_name' in data:
                order.crop_name = data['crop_name']
            if 'quantity' in data:
                order.quantity = data['quantity']
            if 'price_per_kg' in data:
                order.price_per_kg = data['price_per_kg']
            if 'total_price' in data:
                order.total_price = data['total_price']
            elif 'quantity' in data or 'price_per_kg' in data:
                order.total_price = order.quantity * order.price_per_kg
            if 'location' in data:
                order.location = data['location']
            if 'status' in data:
                order.status = data['status']
            
            db.session.commit()
            
            return order.to_dict(), 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    
    def delete(self, order_id):
        """Delete an order"""
        try:
            order = Order.query.get(order_id)
            if not order:
                return {"error": "Order not found"}, 404
            
            db.session.delete(order)
            db.session.commit()
            
            return {"message": "Order deleted successfully"}, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

class OrderStatisticsResource(Resource):
    def get(self):
        """Get order statistics"""
        try:
            farmer_id = request.args.get('farmer_id', type=int)
            
            query = Order.query
            if farmer_id:
                query = query.filter(Order.farmer_id == farmer_id)
            
            all_orders = query.all()
            
            # Calculate statistics
            total_orders = len(all_orders)
            pending_orders = len([o for o in all_orders if o.status == 'pending'])
            completed_orders = len([o for o in all_orders if o.status == 'completed'])
            cancelled_orders = len([o for o in all_orders if o.status == 'cancelled'])
            
            total_revenue = sum(o.compute_total for o in all_orders if o.status == 'completed')
            pending_revenue = sum(o.compute_total for o in all_orders if o.status == 'pending')
            
            # Get top crops
            crop_stats = {}
            for order in all_orders:
                if order.crop_name not in crop_stats:
                    crop_stats[order.crop_name] = {
                        'count': 0,
                        'total_quantity': 0,
                        'total_revenue': 0
                    }
                crop_stats[order.crop_name]['count'] += 1
                crop_stats[order.crop_name]['total_quantity'] += float(order.quantity or 0)
                if order.status == 'completed':
                    crop_stats[order.crop_name]['total_revenue'] += order.compute_total
            
            top_crops = sorted(crop_stats.items(), key=lambda x: x[1]['total_revenue'], reverse=True)[:5]
            
            return {
                'summary': {
                    'total_orders': total_orders,
                    'pending_orders': pending_orders,
                    'completed_orders': completed_orders,
                    'cancelled_orders': cancelled_orders,
                    'total_revenue': round(total_revenue, 2),
                    'pending_revenue': round(pending_revenue, 2)
                },
                'top_crops': [
                    {
                        'name': crop[0],
                        'orders': crop[1]['count'],
                        'quantity': round(crop[1]['total_quantity'], 2),
                        'revenue': round(crop[1]['total_revenue'], 2)
                    } for crop in top_crops
                ]
            }, 200
            
        except SQLAlchemyError as e:
            return {"error": str(e)}, 500
        except Exception as e:
            return {"error": str(e)}, 500
