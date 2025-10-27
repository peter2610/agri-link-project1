# agri-link-backend/routes/dashboard_route.py

from flask import request
from flask_restful import Resource
from sqlalchemy.exc import SQLAlchemyError
from models.dashboard import Dashboard
from models.farmer import Farmer
from models.offer import Crop
from models.order import Order

from config import db

class DashboardResource(Resource):
    def get(self, farmer_id=None):
        """Get dashboard summary for a farmer"""
        try:
            farmer_id = farmer_id or request.args.get('farmer_id', type=int) or 1

            farmer = Farmer.query.get(farmer_id)
            if not farmer:
                return {"error": "Farmer not found"}, 404

            dashboard = Dashboard.query.filter_by(farmer_id=farmer_id).first()
            if not dashboard:
                dashboard = Dashboard(farmer_id=farmer_id)
                db.session.add(dashboard)
                db.session.commit()

            summary = dashboard.get_summary()

            recent_crops = (
                Crop.query.filter_by(farmer_id=farmer_id)
                .order_by(Crop.created_at.desc())
                .limit(5)
                .all()
            )

            recent_orders = (
                Order.query.filter(Order.farmer_id == farmer_id)
                .order_by(Order.created_at.desc())
                .limit(5)
                .all()
            )

            summary['recent_crops'] = [crop.to_dict() for crop in recent_crops]
            summary['recent_orders'] = [order.to_dict() for order in recent_orders]

            return summary, 200

        except SQLAlchemyError as exc:
            return {"error": str(exc)}, 500
        except Exception as exc:
            return {"error": str(exc)}, 500

class FarmerStatsResource(Resource):
    def get(self, farmer_id):
        """Get detailed statistics for a farmer"""
        try:
            farmer = Farmer.query.get(farmer_id)
            if not farmer:
                return {"error": "Farmer not found"}, 404

            from datetime import datetime
            current_month = datetime.utcnow().replace(day=1)

            monthly_orders = Order.query.filter(
                Order.farmer_id == farmer_id,
                Order.created_at >= current_month
            ).all()

            monthly_revenue = sum(o.compute_total for o in monthly_orders if o.status == 'completed')

            stats = {
                'farmer_info': {
                    'id': farmer.id,
                    'full_name': farmer.full_name,
                    'location': farmer.location,
                    'member_since': farmer.created_at.isoformat() if farmer.created_at else None
                },
                'monthly_stats': {
                    'orders': len(monthly_orders),
                    'revenue': round(monthly_revenue, 2),
                    'growth': 12.5
                },
                'crop_distribution': self._get_crop_distribution(farmer_id),
                'collaboration_impact': self._get_collaboration_impact(farmer_id)
            }

            return stats, 200

        except SQLAlchemyError as exc:
            return {"error": str(exc)}, 500
        except Exception as exc:
            return {"error": str(exc)}, 500
    
    def _get_crop_distribution(self, farmer_id):
        """Get distribution of crops by type"""
        crops = Crop.query.filter_by(farmer_id=farmer_id).all()
        distribution = {}
        
        for crop in crops:
            crop_type = crop.type or 'Other'
            if crop_type not in distribution:
                distribution[crop_type] = {
                    'count': 0,
                    'total_quantity': 0
                }
            distribution[crop_type]['count'] += 1
            distribution[crop_type]['total_quantity'] += crop.quantity
        
        return distribution
    
    def _get_collaboration_impact(self, farmer_id):
        """Calculate impact from collaborations"""
        farmer = Farmer.query.get(farmer_id)
        collaborations = getattr(farmer, 'collaborations', []) if farmer else []

        total_co2_saved = sum(getattr(c, 'total_co2_saved', 0) for c in collaborations)
        active_collaborations = [c for c in collaborations if getattr(c, 'status', '').lower() == 'active']

        return {
            'total_collaborations': len(collaborations),
            'active_collaborations': len(active_collaborations),
            'co2_saved': round(total_co2_saved, 2),
            'farmers_connected': len(
                set(
                    f.id
                    for c in collaborations
                    for f in getattr(c, 'farmers', [])
                    if f.id != farmer_id
                )
            ) if collaborations else 0
        }
