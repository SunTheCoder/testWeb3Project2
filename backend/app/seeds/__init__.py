from flask.cli import AppGroup

from app.models.db import SCHEMA, db, environment

from .users import seed_users, undo_users

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
	if environment == 'production':
		# Before seeding in production, undo all tables first
		undo_users()

	# Seed tables
	seed_users()
	print('Seeded all data successfully!')


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
	undo_users()
	print('Reverted all seeded data!')
