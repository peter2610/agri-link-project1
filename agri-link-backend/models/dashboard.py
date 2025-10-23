# agri-link-backend/app/models/dashboard.py

from app.models.farmer import Farmer
from app.models.crop import Crop
from app.models.order import Order
from app.models.collaboration import Collaboration
from app.extensions import db


class Dashboard:
    """
    Dashboard data model (not a DB table)
    Computes aggregated data for a farmer's dashboard.
    """

    def __init__(self, farmer_id: int):
        self.farmer_id = farmer_id

    def get_summary(self):
        """Compute a full dashboard summary for the given farmer."""
        farmer = Farmer.query.get(self.farmer_id)
        if not farmer:
            return {"error": "Farmer not found"}

        # --- Crops ---
        crops = Crop.query.filter_by(farmer_id=self.farmer_id).all()
        total_crops = len(crops)
        total_quantity = sum(c.quantity for c in crops if c.quantity is not None)

        # --- Orders ---
        orders = Order.query.filter_by(farmer_id=self.farmer_id).all()
        total_orders = len(orders)

        completed_orders = [o for o in orders if o.status and o.status.lower() == "completed"]
        pending_orders = total_orders - len(completed_orders)
        total_earnings = sum(
            getattr(o, "total_price", o.quantity * o.price_per_kg)
            for o in completed_orders
            if o.quantity is not None
        )

        # --- Collaborations ---
        collaborations = getattr(farmer, "collaborations", [])
        total_collaborations = len(collaborations)
        total_co2_saved = sum(getattr(c, "total_co2_saved", 0) for c in collaborations)

        # --- Final summary ---
        return {
            "farmer_id": farmer.id,
            "farmer_name": farmer.name,
            "location": farmer.location,
            "total_crops": total_crops,
            "total_quantity": total_quantity,
            "total_orders": total_orders,
            "completed_orders": len(completed_orders),
            "pending_orders": pending_orders,
            "total_earnings": round(total_earnings, 2),
            "total_collaborations": total_collaborations,
            "co2_saved": round(total_co2_saved, 2),
        }
