# agri-link-backend/routes/dashboard_routes.py

from flask import jsonify, request
from flask_restful import Resource
from models.dashboard import Dashboard
from models.farmer import Farmer
from models.offer import Offer, Crop
from models.order import Order
from models.collaboration import Collaboration

from config import db

class DashboardResource(Resource):
    def get(self, farmer_id=None):
        """Get dashboard summary for a farmer"""
        try:
            # For demo purposes, if no farmer_id provided, use farmer_id=1
            if not farmer_id:
                farmer_id = request.args.get('farmer_id', 1)
            
            dashboard = Dashboard(farmer_id)
            summary = dashboard.get_summary()
            
            if "error" in summary:
                return {"error": summary["error"]}, 404
            
            # Add recent activities
            farmer = Farmer.query.get(farmer_id)
            recent_crops = Crop.query.filter_by(farmer_id=farmer_id).order_by(Crop.created_at.desc()).limit(5).all()
            recent_orders = Order.query.filter_by(farmer_id=farmer_id).order_by(Order.created_at.desc()).limit(5).all()
            
            summary['recent_crops'] = [crop.to_dict() for crop in recent_crops]
            summary['recent_orders'] = [order.to_dict() for order in recent_orders]
            
            # Add sustainability insights
            summary['sustainability_insights'] = {
                'water_saved': round(summary.get('total_quantity', 0) * 0.5, 2),  # Mock calculation
                'waste_reduced': round(summary.get('total_quantity', 0) * 0.1, 2),  # Mock calculation
                'efficiency_score': 85  # Mock score
            }
            
            return summary, 200
            
        except Exception as e:
            return {"error": str(e)}, 500

class FarmerStatsResource(Resource):
    def get(self, farmer_id):
        """Get detailed statistics for a farmer"""
        try:
            farmer = Farmer.query.get(farmer_id)
            if not farmer:
                return {"error": "Farmer not found"}, 404
            
            # Calculate monthly stats
            from datetime import datetime, timedelta
            current_month = datetime.utcnow().replace(day=1)
            
            monthly_orders = Order.query.filter(
                Order.farmer_id == farmer_id,
                Order.created_at >= current_month
            ).all()
            
            monthly_revenue = sum(o.compute_total for o in monthly_orders if o.status == 'completed')
            
            stats = {
                'farmer_info': {
                    'id': farmer.id,
                    'name': farmer.name,
                    'location': farmer.location,
                    'farm_size': farmer.farm_size,
                    'member_since': farmer.created_at.isoformat() if farmer.created_at else None
                },
                'monthly_stats': {
                    'orders': len(monthly_orders),
                    'revenue': round(monthly_revenue, 2),
                    'growth': 12.5  # Mock growth percentage
                },
                'crop_distribution': self._get_crop_distribution(farmer_id),
                'collaboration_impact': self._get_collaboration_impact(farmer_id)
            }
            
            return stats, 200
            
        except Exception as e:
            return {"error": str(e)}, 500
    
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
        collaborations = farmer.collaborations if farmer else []
        
        total_co2_saved = sum(c.total_co2_saved for c in collaborations)
        active_collaborations = [c for c in collaborations if c.status == 'active']
        
        return {
            'total_collaborations': len(collaborations),
            'active_collaborations': len(active_collaborations),
            'co2_saved': round(total_co2_saved, 2),
            'farmers_connected': len(set(f.id for c in collaborations for f in c.farmers if f.id != farmer_id))
        }
