# info_world_node_js

#For testing

Run npm run dev

# For the JSON approach, send any JSON in this format: 

{
	"resourceType" : "Practitioner",
	"id": "1",
	"name": [{"family":"TestFamily","given":["TestGiven"],"text":"TestFamily TestGiven"}],
	"facility": [
		{	
			"value": "1",
			"system": "http://us.gov/NPI",
			"name": "Facility Name"
		},
		{	
			"value": "2",
			"system": "http://us.gov/NPI",
			"name": "Other Facility Name"
		}
	],
	"active": true
}

# For the CSV file approach, send any CSV file with this format: 

ID, FamilyName, GivenName, FacilityId, SystemId, NameId, Active
1, Popescu, George, 12, http://ro.gov/NPI, Spital Tulcea, true
1, Popescu, George, 13, http://ro.gov/NPI, Spital Sfantu Gheorghe, true
1, Popescu, George, 13, http://ro.gov/NPI, Spital Constanta, false
2, Ionescu, Catalin, 12, http://ro.gov/NPI, Spital Tulcea, true


The key of the sent CSV file has to be CSV, like in the example below: 

![alt text](https://imgur.com/jL2Wbzy)