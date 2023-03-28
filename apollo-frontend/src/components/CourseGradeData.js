// import { json, useParams } from "react-router-dom";

// let json_data = null;
// var courseDist = [];


// export function CourseGradeData() {
//     const {courseName} = useParams();
//     const fetchCourse = async () => {
//         fetch('http://localhost:5001/api/course/get/grades/' + courseName)
//         .then(response => response.json())
//         .then(data => {
//             json_data = data
//         })
//     }
//     fetchCourse();

//     const json_data_object = JSON.stringify(json_data);

 

//     var j = 0;

//     for (var i in json_data) {
//         courseDist[i] = json_data[i];
//     }

//     courseDist = Object.values(courseDist)



//     courseDist = courseDist.filter(Number.isFinite)

//     console.log(courseDist)


//     return(courseDist)
// } 


