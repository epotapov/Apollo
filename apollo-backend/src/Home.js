import { useEffect, useState }from 'react'

const Home = () => {

    useEffect(() => {
        const fetchWorkouts = async () => {
            const response = await fetch('http://localhost:3000')
            const json = await response.json()

            if (response.ok) {
                setWorkouts(json)
            }
        }

        fetchWorkouts()
    }, [])

    return (
        <div className="home">
            <div className = "workouts">
                
            </div>
        </div>
    )
}

export default Home
