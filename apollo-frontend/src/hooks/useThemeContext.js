import { ThemeContext } from "../context/ThemeContext"
import { useContext } from 'react'

export const useThemeContext = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw Error('useThemeContext must be used inside the ThemeContext provider')
    }

    return context
}