# Data manipulation
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
# Plotting
import matplotlib.pyplot as plt


dataset = pd.read_csv('data_by_genres.csv')

# Review duplicates and drop them
dataset.duplicated().sum()
dataset.drop_duplicates(inplace=True)
# Review missing values
dataset.isnull().sum()
# Drop columns that are not needed for clustering
dataset.drop(["genres"], axis=1, inplace=True)

scaler = MinMaxScaler()
normalized_data = scaler.fit_transform(dataset)

# Calculate the variance for each column
variances = np.var(normalized_data, axis=0)

print("\nVariances for Each Column:")
print(sorted(list(zip(dataset.columns, variances)), key=lambda x: x[1], reverse=True))
#plot the variances
plt.bar(dataset.columns, variances)
plt.xticks(rotation=90)
plt.ylabel("Variance")
plt.xlabel("Column")
plt.title("Variance per Column")
plt.show()
