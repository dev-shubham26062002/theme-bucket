import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface ErrorPageProps {
    statusCode: number,
    message: string,
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    statusCode,
    message,
}) => {
    const [countdown, setCountdown] = useState(5)

    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            setCountdown(countdown - 1)
        }, 1000)

        if (countdown === 0) {
            clearTimeout(timer)
            navigate('/')
        }

        return () => clearTimeout(timer)
    }, [countdown])

    return (
        <main className="h-full flex justify-center items-center mx-6 md:px-0">
            <div className="w-full md:max-w-md p-10 bg-charcoal rounded-lg border border-gray-200 shadow-lg shadow-gray-200 text-center">
                <h1 className="font-bold font-space-grotesk text-yellow-ochre text-4xl text-center tracking-tighter">Error Code {statusCode}!</h1>
                <p className="text-gray-200 text-center mt-1">{message}</p>
                <div className="h-px bg-gray-200 my-6"></div>
                <p className="text-gray-200 text-center">Redirecting to home page in <span className="text-yellow-ochre">{countdown} second{countdown === 1 ? '' : 's'}.</span></p>
            </div>
        </main>
    )
}

export default ErrorPage