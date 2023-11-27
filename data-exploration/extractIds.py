# Data manipulation
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
# Plotting
import matplotlib.pyplot as plt


dataset = pd.read_csv('data.csv')

# Review duplicates and drop them
dataset.duplicated().sum()
dataset.drop_duplicates(inplace=True)
# Review missing values
dataset.isnull().sum()
# Drop columns that are not needed for clustering
newD = dataset.filter(["id"])
#Save the ids on a new file
newD.to_csv('ids.csv', index=False)