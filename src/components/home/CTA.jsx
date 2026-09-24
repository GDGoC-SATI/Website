import React, { useState } from 'react';

const CTA = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        agreed: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Add actual submission logic here
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <section className="py-24 relative overflow-hidden flex justify-center items-center bg-slate-50 dark:bg-slate-900/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>

            <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-xl border border-white/50 dark:border-slate-700">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 font-sans">
                            Stay Updated
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Subscribe to our newsletter and never miss an event, workshop, or community update
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
                        {/* Email Input */}
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue transition-all placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {/* Name Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue transition-all placeholder:text-slate-400"
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-google-blue/20 focus:border-google-blue transition-all placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3 py-2">
                            <input
                                type="checkbox"
                                name="agreed"
                                id="agreed"
                                checked={formData.agreed}
                                onChange={handleChange}
                                className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-google-blue focus:ring-google-blue cursor-pointer accent-google-blue"
                                required
                            />
                            <label htmlFor="agreed" className="text-sm text-slate-500 dark:text-slate-400 text-left">
                                I agree to receive newsletters and accept the <a href="#" className="text-google-blue hover:text-blue-600 dark:hover:text-blue-400 font-medium">Terms and Conditions</a>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-google-blue hover:bg-blue-600 text-white font-medium text-lg py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 font-sans"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default CTA;
