import React from 'react'
import { ourSpecsData } from '@/assets/assets'

const OurSpecs = () => {

    return (
        <section className='px-4 sm:px-6 lg:px-8 py-14 md:py-16 bg-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='text-center mb-12'>
                    <p className='text-green-600 font-semibold uppercase tracking-widest text-sm mb-3'>
                        Features
                    </p>
                    <h2 className='text-3xl md:text-4xl font-semibold text-slate-800'>
                        Why Choose Us
                    </h2>
                    <p className='text-slate-600 mt-3 max-w-2xl mx-auto'>
                        We offer top-tier service and convenience to ensure your property service experience is smooth, secure and completely hassle-free.
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-8'>
                    {
                        ourSpecsData.map((spec, index) => {
                            return (
                                <div className='relative bg-white border-2 border-slate-200 rounded-xl p-8 pt-12 flex flex-col items-center text-center group hover:border-green-600 hover:shadow-lg transition-all duration-300' key={index}>
                                    <div className='absolute -top-5 w-12 h-12 bg-green-600 text-white flex items-center justify-center rounded-xl shadow-md group-hover:scale-110 group-hover:bg-green-700 transition-all duration-300'>
                                        <spec.icon size={24} />
                                    </div>
                                    <h3 className='text-lg font-bold text-slate-800 mb-3 group-hover:text-green-600 transition-colors'>{spec.title}</h3>
                                    <p className='text-sm text-slate-600 leading-relaxed'>{spec.description}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default OurSpecs
