import csv
import json

csvFilePath = 'events.csv'

# Create a dictionary to store course data
courses = {}

# Read the CSV and add the data to the dictionary
with open(csvFilePath) as csvFile:
    csvReader = csv.DictReader(csvFile)
    for rows in csvReader:
        if rows['Type'] == 'Lecture':
            course_name = rows['Name']
            section_data = {
                "Section": rows["Section"],
                "Days": rows["Day Of Week"],
                "StartTime": rows["Published Start"],
                "EndTime": rows["Published End"],
                "Location": rows["Location"],
                "Instructor": rows["Instructor / Organization"].replace('(Instr)', ''),
                "InstructorEmail": rows["Email"]
            }
            # If course already exists, append section data to list
            if course_name in courses:
                courses[course_name]['Sections'].append(section_data)
            # If course doesn't exist, create a new entry with section data
            else:
                course_data = {
                    "Course": course_name,
                    "Sections": [section_data]
                }
                courses[course_name] = course_data
            print("Appending " + rows["Name"])

# Convert the dictionary of course data to JSON format and write it to a file
with open("unitime-lectures.json", 'w') as jsonFile:
    jsonFile.write(json.dumps(list(courses.values()), indent=4))
