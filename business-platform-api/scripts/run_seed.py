import os
import sys

# Ensure project root is on sys.path so "import src" works when this
# script is executed from other working directories or new processes.
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.seed_merchant_data import create_merchant_sample_data
from src.main import app

if __name__ == '__main__':
    with app.app_context():
        create_merchant_sample_data()
        print('SEED_DONE')
