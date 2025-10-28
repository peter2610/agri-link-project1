"""Add created_at to crops

Revision ID: 20251028_add_created_at_to_crops
Revises: 8ef6850926cc
Create Date: 2025-10-28 20:08:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func


# revision identifiers, used by Alembic.
revision = "20251028_add_created_at_to_crops"
down_revision = "8ef6850926cc"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "crops",
        sa.Column("created_at", sa.DateTime(), nullable=True)
    )
    op.execute(
        sa.text("UPDATE crops SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP)")
    )


def downgrade():
    op.drop_column("crops", "created_at")
