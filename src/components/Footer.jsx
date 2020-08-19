import React from 'react';
import { Link } from 'react-router-dom';

const Footer = props => (
    <div
        style={{
            marginTop: '5px',
            marginBottom: '5px',
            height: '1px',
            width: '100%',
            borderTop: '1px solid gray',
        }}
    >
        <footer className="page-footer" style={{ padding: '.5rem' }} >
            <small>
                <ul
                    style={{
                        display: 'flex',
                        listStyle: 'none',
                        position: 'absolute',
                        left: '50%',
                        transform: 'translatex(-50%)',
                    }}
                >
                    <li style={{ marginRight: '2.4rem' }}>
                        <Link to="/termsandconditions">Terms and Conditions</Link>
                    </li>
                    <li style={{ marginRight: '2.4rem' }}>
                        <Link to="/privacypolicy">Privacy Policy</Link>
                    </li>
                </ul>
            </small>
        </footer>
    </div >
);

export default Footer;