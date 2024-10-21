import app
import http.client

conn = http.client.HTTPSConnection("tripadvisor16.p.rapidapi.com")

class Test_App:
    
    def test_showFlights(self):
        assert app.show_flights() 
        
        