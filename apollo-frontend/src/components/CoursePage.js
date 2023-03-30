import { React, useState, useEffect } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
import annotation from 'chartjs-plugin-annotation';

import { useParams } from "react-router-dom";
import Forum from './Forum';

import Navbar from './Navbar';
import { useUserContext } from '../hooks/useUserContext';
import { Collapse, Switch, Table } from 'antd';
import Reviews from './Reviews';
import UploadPdf from './UploadPdf';

const { Panel } = Collapse;
ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    annotation
)

function mapGradeToValue(grade) {
    switch (grade) {
        case 'A+':
            return 4.0;
        case 'A':
            return 4.0;
        case 'A-':
            return 3.7;
        case 'B+':
            return 3.3;
        case 'B':
            return 3.0;
        case 'B-':
            return 2.7;
        case 'C+':
            return 2.3;
        case 'C':
            return 2.0;
        case 'C-':
            return 1.7;
        case 'D+':
            return 1.3;
        case 'D':
            return 1.0;
        case 'D-':
            return 0.0;
        case 'F':
            return 0.0;
        default:
            return 0.0;
    }
}

export default function CoursePage() {
    const { courseName } = useParams();
    const [Title, setTitle] = useState('');
    const [CreditHours, setCreditHours] = useState('');
    const [Description, setDescription] = useState('');
    const [favorite, setFavorite] = useState(false);
    const [checkedFavorite, setCheckedFavorite] = useState(false);
    const [favCourses, setFavCourses] = useState([]);
    const [courseDist, setcourseDist] = useState([]);
    const [sections, setSections] = useState([]);
    const [TypicallyOffered, setTypicallyOffered] = useState('');

    const [size, setSize] = useState('large');
    const { user } = useUserContext();
    let username = '';
    if (user)
        username = user.username;

    useEffect(() => {
        const fetchCourse = async () => {
            fetch('http://localhost:5001/api/course/get/' + courseName)
                .then(response => response.json())
                .then(data => {
                    setTitle(data.Title);
                    setCreditHours(data.CreditHours);
                    setDescription(data.Description);
                    setSections(data.Sections);
                    setTypicallyOffered(data.TypicallyOffered);
                })
        }
        fetchCourse();

        if (user != null && user.favCourses) {
            setFavorite(true);
        }
    }, [courseName]);

    useEffect(() => {
        fetch('http://localhost:5001/api/user/get-favCourses/' + username)
            .then(response => response.json())
            .then(data => {
                setFavCourses(data);
                console.log("favorite courses: ", favCourses)
            })
        fetch('http://localhost:5001/api/course/get/grades/' + courseName)
            .then(response => response.json())
            .then(data => {
                var gradeArray = [];
                var json_data = data;
                for (var i in json_data) {
                    gradeArray[i] = json_data[i];
                }
                gradeArray = Object.values(gradeArray)

                gradeArray = gradeArray.filter(Number.isFinite)

                setcourseDist(gradeArray)


            })
    }, [courseName]);

    var gradeData = {
        labels: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'],
        datasets: [{
            label: 'Number of Students',
            data: courseDist,
            backgroundColor: 'orange',
            bordecolor: 'black',
            borderwidth: 1,
            fill: false
        }]

    }


    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

    const totalValue = courseDist.reduce((acc, num, index) => {
        return acc + (num * mapGradeToValue(grades[index]));
    }, 0);


    const avgValue = totalValue / courseDist.reduce((acc, num) => acc + num, 0);

    let avgGrade;
    if (avgValue >= 4.0) {
        avgGrade = 'A+';
    } else if (avgValue >= 3.7) {
        avgGrade = 'A-';
    } else if (avgValue >= 3.3) {
        avgGrade = 'B+';
    } else if (avgValue >= 3.0) {
        avgGrade = 'B';
    } else if (avgValue >= 2.7) {
        avgGrade = 'B-';
    } else if (avgValue >= 2.3) {
        avgGrade = 'C+';
    } else if (avgValue >= 2.0) {
        avgGrade = 'C';
    } else if (avgValue >= 1.7) {
        avgGrade = 'C-';
    } else if (avgValue >= 1.3) {
        avgGrade = 'D+';
    } else if (avgValue >= 1.0) {
        avgGrade = 'D';
    } else {
        avgGrade = 'F';
    }
    console.log(avgGrade)

    useEffect(() => {
        let found = false;
        for (let i = 0; i < favCourses.length; i++) {
            if (favCourses[i] === courseName) {
                setCheckedFavorite(true);
                found = true;
            }
        }
        if (!found)
            setCheckedFavorite(false);
    }, [favCourses]);

    const checkClass = () => {
        console.log("hello")
        for (let i = 0; i < favCourses.length; i++) {
            if (favCourses[i] === courseName)
                return true;
        }
        return false;
    }

    const favClass = async () => {
        console.log("run favClass")
        let found = false;
        for (let i = 0; i < favCourses.length; i++) {
            if (favCourses[i] === courseName) {
                favCourses.splice(i, 1);
                found = true;
            }
        }
        if (!found) {
            favCourses.push(courseName)
        }
        const newFavCourse = { username, favCourses };
        const response = await fetch('http://localhost:5001/api/user/add-favCourse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, favCourses })
        });

        const json = await response.json();

        if (!response.ok) {
            console.log("successful switch for user")
        }
        else {
            console.log("not successful switch for user course")
        }
    }

    const sectionsColumns = [
        {
            title: 'Section',
            dataIndex: 'Section',
            key: 'Section',
            render: text => text || 'N/A',
        },
        {
            title: 'Days',
            dataIndex: 'Days',
            key: 'Days',
            render: text => text || 'N/A',
        },
        {
            title: 'Time',
            dataIndex: 'Time',
            key: 'Time',
            render: (text, record) => {
                const { StartTime, EndTime } = record;
                if (StartTime && EndTime) {
                    return `${StartTime} - ${EndTime}`;
                }
                return 'N/A';
            }
        },
        {
            title: 'Location',
            dataIndex: 'Location',
            key: 'Location',
            render: text => text || 'N/A',
        },
        {
            title: 'Instructor',
            dataIndex: 'Instructor',
            key: 'Instructor',
            render: text => text || 'N/A',
        },
        {
            title: 'Instrcutor Email',
            dataIndex: 'InstructorEmail',
            key: 'InstructorEmail',
            render: text => text || 'N/A',
        }
    ];

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            annotation: {
                annotations: [
                    {
                        type: 'line',
                        mode: 'vertical',
                        scaleID: 'x',
                        value: avgGrade,
                        borderColor: 'black',
                        borderWidth: 5,
                        label: {
                            content: 'Average Grade',
                            enabled: true,
                            position: 'start',
                            color: 'black',
                            z: 10000
                        }
                    }
                ]
            },
            legend: {
                display: true,
                position: 'top'
            }
        }
    };

    return (
        <div id='cont'>
            <Navbar />
            <div className='namePage'>
                <h1> {courseName} </h1>
            </div>
            <div className='bodyPage'>
                <h2>Title: </h2>
                <p>{Title}</p>
                {
                    user != null &&
                    <section>
                        <h2>Favorite Class:</h2>
                        <Switch checked={checkedFavorite} onChange={() => {
                            favClass();
                            setCheckedFavorite(!checkedFavorite);
                        }} />
                    </section>
                }
                <h2>Credit Hours:</h2>
                <p>{CreditHours}</p>
                {
                    Description.length != 0 && <div><h2>Description: </h2><p>{Description}</p></div>
                }
                <UploadPdf name={courseName}/>
                <h2> Typically Offered: </h2>
                {TypicallyOffered ? (
                    <p>{TypicallyOffered}</p>
                ) : (
                    <p>Course availability information not available.</p>
                )}
                <h2>Sections:</h2>
                {sections.length > 0 ? (
                    <Table
                        columns={sectionsColumns}
                        dataSource={sections}
                        pagination={false}
                        key={sections.Section}
                    />
                ) : (
                    <p>No sections found</p>
                )}
                <Forum courseName={courseName} />
                <Reviews name={courseName} type={"course"} />
                <h2>Grade Distribution</h2>
                <div style={{ width: 700 }}>
                    <Bar
                        data={gradeData}
                        options={options}
                    ></Bar>
                    <div style={{ marginTop: '10px', fontSize: '12px', textAlign: 'center' }}>
                        <p> Data retrieved from: Boiler Grades </p>
                        <p> Data is from the Fall 2022 semester </p>
                    </div>
                </div>
            </div>
        </div>
    )
}