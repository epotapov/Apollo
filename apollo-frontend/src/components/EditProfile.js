import { React, useState } from 'react';
import { Link } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Select, DatePicker, InputNumber, message, Switch, Upload } from 'antd';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {LinkedinFilled, InstagramFilled, TwitterCircleFilled, PlusOutlined } from '@ant-design/icons';


let user = null;
let username = '';
let aboutMe = '';
let dob = '';
let major = '';
let isPrivate = null;
let year = '';
let role = '';
let email = '';
let emailNotif = null;
let country = '';
let gender = '';
let gradYear = '';
let courses = {};
let planOfStudy = {};
let instagramLink = '';
let linkedinLink = '';
let twitterLink = '';
let favCourses = ""


const picServer = "http://localhost:5001/pictures/"

const countryList = [
    "Afghanistan",
	"Albania",
	"Algeria",
	"American Samoa",
	"Andorra",
	"Angola",
	"Anguilla",
	"Antarctica",
	"Antigua and Barbuda",
	"Argentina",
	"Armenia",
	"Aruba",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas (the)",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bermuda",
	"Bhutan",
	"Bolivia (Plurinational State of)",
	"Bonaire, Sint Eustatius and Saba",
	"Bosnia and Herzegovina",
	"Botswana",
	"Bouvet Island",
	"Brazil",
	"British Indian Ocean Territory (the)",
	"Brunei Darussalam",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cabo Verde",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Cayman Islands (the)",
	"Central African Republic (the)",
	"Chad",
	"Chile",
	"China",
	"Christmas Island",
	"Cocos (Keeling) Islands (the)",
	"Colombia",
	"Comoros (the)",
	"Congo (the Democratic Republic of the)",
	"Congo (the)",
	"Cook Islands (the)",
	"Costa Rica",
	"Croatia",
	"Cuba",
	"Curaçao",
	"Cyprus",
	"Czechia",
	"Côte d'Ivoire",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic (the)",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Falkland Islands (the) [Malvinas]",
	"Faroe Islands (the)",
	"Fiji",
	"Finland",
	"France",
	"French Guiana",
	"French Polynesia",
	"French Southern Territories (the)",
	"Gabon",
	"Gambia (the)",
	"Georgia",
	"Germany",
	"Ghana",
	"Gibraltar",
	"Greece",
	"Greenland",
	"Grenada",
	"Guadeloupe",
	"Guam",
	"Guatemala",
	"Guernsey",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Heard Island and McDonald Islands",
	"Holy See (the)",
	"Honduras",
	"Hong Kong",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran (Islamic Republic of)",
	"Iraq",
	"Ireland",
	"Isle of Man",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jersey",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Korea (the Democratic People's Republic of)",
	"Korea (the Republic of)",
	"Kuwait",
	"Kyrgyzstan",
	"Lao People's Democratic Republic (the)",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Macao",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands (the)",
	"Martinique",
	"Mauritania",
	"Mauritius",
	"Mayotte",
	"Mexico",
	"Micronesia (Federated States of)",
	"Moldova (the Republic of)",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Montserrat",
	"Morocco",
	"Mozambique",
	"Myanmar",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands (the)",
	"New Caledonia",
	"New Zealand",
	"Nicaragua",
	"Niger (the)",
	"Nigeria",
	"Niue",
	"Norfolk Island",
	"Northern Mariana Islands (the)",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestine, State of",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines (the)",
	"Pitcairn",
	"Poland",
	"Portugal",
	"Puerto Rico",
	"Qatar",
	"Republic of North Macedonia",
	"Romania",
	"Russian Federation (the)",
	"Rwanda",
	"Réunion",
	"Saint Barthélemy",
	"Saint Helena, Ascension and Tristan da Cunha",
	"Saint Kitts and Nevis",
	"Saint Lucia",
	"Saint Martin (French part)",
	"Saint Pierre and Miquelon",
	"Saint Vincent and the Grenadines",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Sint Maarten (Dutch part)",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Georgia and the South Sandwich Islands",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"Sudan (the)",
	"Suriname",
	"Svalbard and Jan Mayen",
	"Sweden",
	"Switzerland",
	"Syrian Arab Republic",
	"Taiwan",
	"Tajikistan",
	"Tanzania, United Republic of",
	"Thailand",
	"Timor-Leste",
	"Togo",
	"Tokelau",
	"Tonga",
	"Trinidad and Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Turks and Caicos Islands (the)",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates (the)",
	"United Kingdom of Great Britain and Northern Ireland (the)",
	"United States Minor Outlying Islands (the)",
	"United States of America (the)",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Venezuela (Bolivarian Republic of)",
	"Viet Nam",
	"Virgin Islands (British)",
	"Virgin Islands (U.S.)",
	"Wallis and Futuna",
	"Western Sahara",
	"Yemen",
	"Zambia",
	"Zimbabwe",
	"Åland Islands"
];


const {Option} = Select;

export default function EditProfile() { 

	const [messageApi, contextHolder] = message.useMessage();
	const success = (message) => {
		messageApi.open({
			type: 'success',
			content: message,
		  });
	};	

	const [courseData, setCourseData] = useState([]); // for course dropdown
	useEffect(() => {
        fetch('http://localhost:5001/api/course/getAll')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let val = data[i].Course + ": " + data[i].Title;
                const element = {value: val, label: val, group: 'Courses'};
                setCourseData(courseData => courseData.concat(element));
            }
        })
	}, []);

	const navigate = useNavigate();
	const onFinish = (values) => {
		handleSubmit(values);
	};
	const handleSubmit = async (values) => {

		aboutMe = values.aboutme ? values.aboutme : aboutMe;
		gradYear = values.gradyear ? values.gradyear : gradYear;
		dob = values.dob ? values.dob : dob;
		major = values.major ? values.major : major;
		country = values.country ? values.country : country;
		year = values.classyear ? values.classyear : year;
		gender = values.gender ? values.gender : gender;
		planOfStudy = values.planofstudy ? values.planofstudy : planOfStudy;
		courses = values.courses ? values.courses : courses;
		isPrivate = (values.privateprofile !== "undefined") ? values.privateprofile : isPrivate;
		emailNotif = (values.emailnotif !== "undefined") ? values.emailNotif : emailNotif;
		instagramLink = values.instagram ? values.instagram : instagramLink;
		linkedinLink = values.linkedin ? values.linkedin : linkedinLink;
		twitterLink = values.twitter ? values.twitter : twitterLink;

		const updated_user = {aboutMe, username, email, major, gradYear, role, courses, 
			country, gender, planOfStudy, dob, year, isPrivate, emailNotif,
			instagramLink, linkedinLink, twitterLink, favCourses};
		
		const response = await fetch('http://localhost:5001/api/user/edit', {
			method: 'POST',
			body: JSON.stringify(updated_user),
			headers: {
			  'Content-Type': 'application/json'
			}
		});
		<success message="Profile updated successfully!"/>
		const path = "/profile/" + username;
		navigate(path);
	}

	const data = useLocation();
	if (data.state != null) {
		user = data.state.user;
		if (user != null) {
		  username = user.username;
		  aboutMe = user.aboutMe;
		  dob = user.DOB;
		  major = user.major;
		  year = user.currentYear;
		  email = user.email;
		  gradYear = user.gradYear;
		  if (user.isProf) {
			role = "Professor";
		  }
		  else {
			role = "Student";
		  }
		  country = user.country;
		  gender = user.gender;
		  gradYear = user.gradYear;
		  planOfStudy = user.planOfStudy;
		  courses = user.courses;
		  isPrivate = user.isPrivate;
		  emailNotif = user.emailNotif;
		  instagramLink = user.instagramLink;
		  twitterLink = user.twitterLink;
		  linkedinLink = user.linkedinLink;
		  favCourses = user.favCourses;
		}
	}
    const [size, setSize] = useState('large');


	const beforeUpload = (file) => {
		const isPng = file.type === 'image/png';
		const isJpg = file.type === 'image/jpeg';
		if (!isPng && !isJpg) {
		  message.error('You can only upload PNG/JPEG file!');
		}

		return isPng || isJpg;
	}

	const handleChange = info => {
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList);
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	};
	
    return (
        <div className="container">
            <Form 
                name="tellusmore"
                labelCol={{
                    span: 12,
                }} 
                wrapperCol={{
                    span: 24,
                }}
                style={{
                    maxWidth: 1000,
					width: '100%',
					margin: 'auto',
					padding: '20px',
					display: 'inline-block',
					backgroundColor: 'white',
					borderRadius: '10px',
					boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)',
					marginTop: '20px',
					marginBottom: '20px',
                }}
                initialValues={{
                    remember: true,
					
                }}
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <h2> Tell Us More </h2>
				<Form.Item
					label="Upload Profile Picture"
				>
					<Upload
						name="profilepic"
						beforeUpload={beforeUpload}
						onChange={handleChange}
						showUploadList={false}
						action={`http://localhost:5001/api/user/upload-image/${username}`}
						headers= {{'username': username}}
					>
						<Button icon={<UploadOutlined />} type="Primary"> Upload </Button>
					</Upload>
				</Form.Item>
				<Form.Item
					
					name="aboutme"
					label="About Me"
					value="aboutMe"
				>
					<Input.TextArea 
						placeholder="About Me"
						showCount={true}
						allowClear={true}
						defaultValue={aboutMe}
						autoSize={true} />
				</Form.Item>
                <Form.Item 
                    name="gender"
                    label="Gender"
                >
                    <Select 
						placeholder="Select Your Gender" 
						defaultValue={gender}
					>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="country"
                    label="Country"
                >
                    <Select 
                        placeholder="Select Country"
                        showSearch
						defaultValue={country}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        value={country}
                        options={countryList.map((country) => ({ label: country, value: country }))}
                    />
                </Form.Item>
                <Form.Item
                    name ="classyear"
                    label="Class Year"
                >
                    <Select placeholder="Select Class Year" allowClear defaultValue={year}>
                        <Option value="freshman">Freshman</Option>
                        <Option value="sophomore">Sophomore</Option>
                        <Option value="junior">Junior</Option>
                        <Option value="senior">Senior</Option>
                        <Option value="graduate">Graduate</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="major"
                    label="Major"
                >
                    <Input placeholder="Major" defaultValue={major} />
                </Form.Item>
                <Form.Item
                    name="dob"
                    label="Date of Birth"
                    defaultValue={dob}
                >
                    <DatePicker />
                </Form.Item>
				<Form.Item
					name="courses"
					label="Courses"
				>
					<Select
						mode="multiple"
						placeholder="Insert courses"
						defaultValue={courses}
						style={{ width: '100%' }}
						options={courseData}
					/>
				</Form.Item>
				<Form.Item
					name="gradyear"
					label="Graduation Year"
					defaultValue={gradYear}
				>
					<InputNumber min={2020} max={2040} placeholder="Graduation Year" />
				</Form.Item>
				<Form.Item
					name="planofstudy"
					label="Plan of Study"
				> 
					<Select
						mode="multiple"
						placeholder="Insert courses"
						defaultValue={planOfStudy}
						style={{ width: '100%' }}
						options={courseData}
   					/>
				</Form.Item>
				<Form.Item
					name="privateprofile"
					label="Private Profile"
				>
					<Switch defaultChecked={isPrivate} onChange={(checked) => {message.success(`Profile is now ${checked ? 'private' : 'public'}`, 1);}}/>
				</Form.Item> 
				<Form.Item
					name="emailNotif"
					label="Email Notifications"
				>
					<Switch defaultChecked={emailNotif} 
						onChange={(checked) => { message.success(`Email notifications are now ${checked ? 'on' : 'off'}`, 1); }}
					/>
				</Form.Item>
				<h3> Social Media Links </h3>
				<Form.Item
					name="instagram"
					label="Instagram"
				>
					<Input prefix={<InstagramFilled />} placeholder="Instagram" defaultValue={instagramLink} allowClear/>
				</Form.Item>
				<Form.Item
					name="twitter"
					label="Twitter"
				>
					<Input prefix={<TwitterCircleFilled />} placeholder="Twitter" defaultValue={twitterLink} allowClear/>
				</Form.Item>
				<Form.Item
					name="linkedin"
					label="LinkedIn"
				>
					<Input prefix={<LinkedinFilled />} placeholder="LinkedIn" defaultValue={linkedinLink} allowClear/>
				</Form.Item>
                <Form.Item
                wrapperCol={{
                    offset: 8,
                    span: 16,
                }}
                >
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
                </Form.Item>
            </Form>
        </div>
    );
}