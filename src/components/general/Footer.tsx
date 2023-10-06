import { useLocation, Link } from 'react-router-dom'
import { AiOutlineMail } from 'react-icons/ai'

import LogoLink from '@/components/general/LogoLink'
import { FiInstagram, FiLinkedin, FiTwitter, FiGithub } from 'react-icons/fi'

const Footer = () => {
    const location = useLocation()

    const socialLinksRoutes = [
        {
            to: '#',
            icon: AiOutlineMail,
        }, {
            to: '#',
            icon: FiGithub,
        }, {
            to: '#',
            icon: FiTwitter,
        }, {
            to: '#',
            icon: FiLinkedin,
        }, {
            to: '#',
            icon: FiInstagram,
        },
    ]

    const footerLinksSections = [
        {
            title: 'Browse Categories',
            routes: [
                {
                    to: '/',
                    label: 'Themes & Templates',
                }, {
                    to: '/categories',
                    label: 'Categories',
                },
            ],
        }, {
            title: 'How to Buy?',
            routes: [
                {
                    to: '/',
                    label: 'Explore Theme Bucket',
                },
                {
                    to: '/auth',
                    label: 'Log in',
                },
                {
                    to: '/auth',
                    label: 'Create an Account',
                },
            ],
        }, {
            title: 'How to Sell?',
            routes: [
                {
                    to: '#',
                    label: 'Seller\'s Guide',
                },
                {
                    to: '#',
                    label: 'Upload Instructions',
                },
            ],
        }, {
            title: 'Social Media',
            routes: [
                {
                    to: '#',
                    label: 'Email',
                },
                {
                    to: '#',
                    label: 'Facebook',
                },
                {
                    to: '#',
                    label: 'Instagram',
                },
                {
                    to: '#',
                    label: 'Twitter',
                },
                {
                    to: '#',
                    label: 'LinkedIn',
                },
            ],
        },
    ]

    return (
        <div className="z-40 p-10 lg:px-40 bg-charcoal">
            <div className="flex flex-col justify-center items-center md:justify-between md:flex-row">
                <LogoLink to={location.pathname} />
                <div className="flex items-center gap-x-2">

                    {socialLinksRoutes.map((route, index) => (
                        <Link key={index} className="text-white hover:text-yellow-ochre transition-all" to={route.to} target="_blank">
                            <route.icon className="w-5 h-5" />
                        </Link>
                    ))}

                </div>
            </div>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-10">

                {footerLinksSections.map((section, index) => (
                    <div key={index}>
                        <h1 className="uppercase font-semibold text-white">{section.title}</h1>
                        <div className="h-px mb-2 bg-yellow-ochre"></div>
                        <div className="mt-4 flex flex-col gap-y-2">

                            {section.routes.map((route, index) => (
                                <Link key={index} className="text-gray-400 font-medium hover:text-white transition-all w-fit" to={route.to}>{route.label}</Link>
                            ))}

                        </div>
                    </div>
                ))}

            </div>
            <div className="mt-10 text-center">
                <h1 className="text-white text-lg font-semibold">&#169; 2023, ThemeBucket</h1>
                <p className="text-gray-400 font-medium text-sm">All rights reserved. Made in India</p>
            </div>
        </div>
    )
}

export default Footer