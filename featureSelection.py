from sklearn.datasets import load_iris
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import f_classif
X, y = load_iris(return_X_y=True)
print(X)
print(y)
print(X.shape)
X_new = SelectKBest(f_classif, k=2).fit_transform(X, y)
print(X_new.shape)