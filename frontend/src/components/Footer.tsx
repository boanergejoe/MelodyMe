import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
    return (
        <footer className='bg-black text-gray-400 py-8 px-4'>
            <div className='max-w-6xl mx-auto'>
                {/* Footer Links Grid - 4 columns like Spotify */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
                    {/* Company */}
                    <div>
                        <h3 className='text-white font-semibold mb-4'>Company</h3>
                        <ul className='space-y-2 text-sm'>
                            <li><a href='https://www.spotify.com/rw/about-us/contact/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>About</a></li>
                            <li><a href='https://www.lifeatspotify.com/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Jobs</a></li>
                            <li><a href='https://newsroom.spotify.com/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>For the Record</a></li>
                        </ul>
                    </div>

                    {/* Communities */}
                    <div>
                        <h3 className='text-white font-semibold mb-4'>Communities</h3>
                        <ul className='space-y-2 text-sm'>
                            <li><a href='https://artists.spotify.com/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>For Artists</a></li>
                            <li><a href='https://developer.spotify.com/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Developers</a></li>
                            <li><a href='https://ads.spotify.com/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Advertising</a></li>
                            <li><a href='https://investors.spotify.com/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Investors</a></li>
                            <li><a href='https://spotifyforvendors.com/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Vendors</a></li>
                        </ul>
                    </div>

                    {/* Useful links */}
                    <div>
                        <h3 className='text-white font-semibold mb-4'>Useful links</h3>
                        <ul className='space-y-2 text-sm'>
                            <li><a href='https://support.spotify.com/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Support</a></li>
                            <li><a href='https://www.spotify.com/rw/free/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Free Mobile App</a></li>
                            <li><a href='https://open.spotify.com/popular-in/rw' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Popular by Country</a></li>
                            <li><a href='https://www.spotify.com/rw/import-music/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Import your music</a></li>
                        </ul>
                    </div>

                    {/* Plans */}
                    <div>
                        <h3 className='text-white font-semibold mb-4'>Plans</h3>
                        <ul className='space-y-2 text-sm'>
                            <li><a href='https://www.spotify.com/rw/premium/#ref=spotifycom_footer_premium_individual' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Premium Individual</a></li>
                            <li><a href='https://www.spotify.com/rw/duo/#ref=spotifycom_footer_premium_duo' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Premium Duo</a></li>
                            <li><a href='https://www.spotify.com/rw/family/#ref=spotifycom_footer_premium_family' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Premium Family</a></li>
                            <li><a href='https://www.spotify.com/rw/student/#ref=spotifycom_footer_premium_student' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Premium Student</a></li>
                            <li><a href='https://www.spotify.com/rw/free/#ref=spotifycom_footer_free' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Spotify Free</a></li>
                        </ul>
                    </div>
                </div>

                {/* Social Media Icons - Below columns like Spotify */}
                <div className='flex justify-center space-x-6 mb-8'>
                    <a href='https://instagram.com/spotify' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white transition-colors'>
                        <Instagram className='h-6 w-6' />
                    </a>
                    <a href='https://twitter.com/spotify' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white transition-colors'>
                        <Twitter className='h-6 w-6' />
                    </a>
                    <a href='https://www.facebook.com/Spotify' target='_blank' rel='noopener noreferrer' className='text-gray-400 hover:text-white transition-colors'>
                        <Facebook className='h-6 w-6' />
                    </a>
                </div>

                {/* Bottom section with copyright and legal links */}
                <div className='border-t border-gray-700 pt-8'>
                    <div className='text-center mb-4'>
                        <span className='text-sm'>© 2024 Spotify AB</span>
                    </div>
                    <div className='flex flex-wrap justify-center items-center space-x-4 text-sm'>
                        <a href='https://www.spotify.com/rw/legal/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Legal</a>
                        <a href='https://www.spotify.com/rw/safetyandprivacy/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Safety & Privacy Center</a>
                        <a href='https://www.spotify.com/rw/legal/privacy-policy/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Privacy Policy</a>
                        <a href='https://www.spotify.com/rw/legal/cookies-policy/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Cookies</a>
                        <a href='https://www.spotify.com/rw/legal/privacy-policy/#s3' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>About Ads</a>
                        <a href='https://www.spotify.com/rw/accessibility/' target='_blank' rel='noopener noreferrer' className='hover:text-white hover:underline'>Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;