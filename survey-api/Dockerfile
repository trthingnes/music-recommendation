FROM python:3.12

# Install the required Python packages to run the API
RUN pip install flask
RUN pip install flask-cors
RUN pip install numpy
RUN pip install scipy
RUN pip install scikit-learn
RUN pip install pandas
RUN pip install spotipy
RUN pip install google-auth
RUN pip install google-auth-httplib2
RUN pip install google-api-python-client

# Create folder for the API and copy files into it
WORKDIR /survey-api
COPY . .

EXPOSE 8080

# Start the Python script
CMD ["python", "api.py"]