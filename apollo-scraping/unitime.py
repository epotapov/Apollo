import csv
import json

csvFilePath = 'events.csv'

# Read the CSV and add the data to a list
courseData = []
with open(csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
        if rows['Type'] == 'Lecture':
            data = {
                "Course": rows["Name"],
                "Section": rows["Section"],
                # "Type": rows["Type"],
                "Days": rows["Day Of Week"],
                "StartTime": rows["Published Start"],
                "EndTime": rows["Published End"],
                "Location": rows["Location"],
                "Instructor": rows["Instructor / Organization"],
                "InstructorEmail": rows["Email"]
            }
            data["Course"] = data["Course"].replace(" ", "")
            data["Instructor"] = data["Instructor"].replace("(Instr)", "").strip()
            courseData.append(data)
            print("Appending " + rows["Name"])

# Convert the list of dictionaries to JSON format and write it to a file
with open("unitime-lectures.json", 'w') as jsonFile:
    jsonFile.write(json.dumps(courseData, indent=4))
