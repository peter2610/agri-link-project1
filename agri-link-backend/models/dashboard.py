# agri-link-backend/models/dashboard.py

from sqlalchemy_serializer import SerializerMixin
from models.farmer import Farmer
from models.crop import Crop
from models.orders import Order
from models.collaboration import Collaboration

class Dashboard(SerializerMixin):
    """
    Dashboard helper class (not a DB table)
    Computes aggregated data for a farmer's dashboard.
    """

    def __init__(self, farmer_id: int):
        self.farmer_id = farmer_id

    def get_summary(self):
        farmer = Farmer.query.get(self.farmer_id)
        if not farmer:
            return {"error": "Farmer not found"}

        # --- Crops ---
        crops = Crop.query.filter_by(farmer_id=self.farmer_id).all()
        total_crops = len(crops)
        total_quantity = sum(c.quantity for c in crops if c.quantity is not None)

        # --- Orders ---
        orders = Order.query.filter_by(farmer_id=self.farmer_id).all()
        completed_orders = [o for o in orders if o.status.lower() == "completed"]
        pending_orders = len(orders) - len(completed_orders)
        total_earnings = sum(o.compute_total for o in completed_orders)

        # --- Collaborations ---
        collaborations = getattr(farmer, "collaborations", [])
        total_collaborations = len(collaborations)
        total_co2_saved = sum(getattr(c, "total_co2_saved", 0) for c in collaborations)

        return {
            "farmer_id": farmer.id,
            "farmer_name": farmer.name,
            "location": farmer.location,
            "total_crops": total_crops,
            "total_quantity": total_quantity,
            "total_orders": len(orders),
            "completed_orders": len(completed_orders),
            "pending_orders": pending_orders,
            "total_earnings": round(total_earnings, 2),
            "total_collaborations": total_collaborations,
            "co2_saved": round(total_co2_saved, 2),
        }
