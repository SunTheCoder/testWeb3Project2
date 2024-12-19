"""wallet table updated to not save private key

Revision ID: df4eb4c827cd
Revises: e87132512a2b
Create Date: 2024-12-19 12:24:18.521467

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'df4eb4c827cd'
down_revision = 'e87132512a2b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wallets', schema=None) as batch_op:
        batch_op.drop_column('wallet_key')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('wallets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('wallet_key', sa.TEXT(), nullable=True))

    # ### end Alembic commands ###