import React from 'react';

const Newsletter = () => {
  return (
    <div class="flex flex-col items-center justify-center text-center space-y-2 md:px-4 my-10 mb-40">
        <h1 class="md:text-4xl text-2xl font-semibold">Don’t Miss Out on Our Best Deals!</h1>

        <p class="md:text-lg text-gray-600 pb-8 mt-3 mb-2">Get the latest car rental offers, premium vehicle updates, and exclusive deals delivered straight to your inbox.</p>

        <form class="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
            <input class="border border-gray-400 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-600"
            type="text" placeholder="Enter your email id" required />
            
            <button type="submit" class="md:px-12 px-8 h-full text-lg font-bold text-white bg-blue-600 hover:bg-blue-800 transition-all cursor-pointer rounded-md rounded-l-none">Subscribe</button>
        </form>
    </div>
    )
}

export default Newsletter;