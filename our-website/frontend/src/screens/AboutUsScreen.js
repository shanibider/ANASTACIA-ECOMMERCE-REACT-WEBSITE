import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutUs = () => {
  return (
    <div className="AboutUsContainer">
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <h1>About Us</h1>
      <div className="AboutUs">
        <p>
          <h6 className="summery">
            We are passionate and highly motivated software developers. We like
            to challenge ourselves, learn, develop and explore existing and new
            fields. We really like Full Stack/ Backend/ Frontend development.
            and highly knowledgeable in- React.js, Node.js,express, JavaScript,
            MongoDB, Java.
          </h6>
        </p>

        <p>
          <h6 className="summery">
            In this project, we demonstrated our programming abilities, and
            gained additional knowledge and experience in this field. We enjoyed
            working in a team and creating this beautiful site, which can be
            used by a wide variety of people.
          </h6>
        </p>
        <ul className="teamList">
          <h3>Meet the Team</h3>

          <li className="person">
            <strong>Shani Bider</strong> - Full Stack Developer
            <br />
            <a href="https://www.linkedin.com/in/shani-bider-0848b8177/">
              View Shani's linkedin
            </a>
            <p className="role">Lead Developer</p>
            <img
              src="https://media.licdn.com/dms/image/D4D03AQF1ATwg7f0rSA/profile-displayphoto-shrink_800_800/0/1676454943752?e=1681948800&v=beta&t=UbdKbxPns1LTxDR6vEupuAy8rcThM0Yg6SAfIoBdVLc"
              alt="Shani Bider"
              width="200"
              height="200"
            />
            <br />
            <br></br>
          </li>
          <li className="person">
            <strong>Shira Balali</strong> - Full Stack Developer
            <br />
            <a href="https://www.linkedin.com/in/shira-balali-39917a1b2/">
              View Shira's linkedin
            </a>
            <p className="role">Content Manager</p>
            <img
              src="https://media.licdn.com/dms/image/D4D35AQFItEE6fqeIDA/profile-framedphoto-shrink_400_400/0/1653036154705?e=1676995200&v=beta&t=8R2rlpAlDkR0PtyFHamNIywLfuw3BCXk4TJo78fS2jY"
              alt="Shani Bider"
              width="200"
              height="200"
            />
            <br />
            <br></br>
          </li>
          <li className="person">
            <strong>Rafael Navon</strong> - Full Stack Developer
            <br />
            <a href="https://www.linkedin.com/in/rafael-navon/">
              View Rafael's linkedin
            </a>
            <p className="role">Lead Designer</p>
            <img
              src="https://media.licdn.com/dms/image/C4E03AQHEw_eJ8c3JMw/profile-displayphoto-shrink_400_400/0/1616965889497?e=1681948800&v=beta&t=9GRHUTUCwThdwXcNVcb-DXVXqjldWeswaX56CJk_6T0"
              alt="Shani Bider"
              width="200"
              height="200"
            />
            <br />
            <br></br>
          </li>
          <li className="person">
            <strong>Or Reuven</strong> - Full Stack Developer
            <br />
            <a href="https://www.linkedin.com/in/or-reuven/">
              View Or's linkedin
            </a>
            <p className="role">Founder and CEO</p>
            <img
              src="https://media.licdn.com/dms/image/C5603AQEpgoWEFh_DkQ/profile-displayphoto-shrink_400_400/0/1606381029456?e=1681948800&v=beta&t=uMMwlzF8_v5Y2wNjLxC_HtM4IEPeCg_Jc6tDAmsl7DI"
              alt="Shani Bider"
              width="200"
              height="200"
            />
            <br />
            <br></br>
          </li>
        </ul>
      </div>
      <h3>Contact Us</h3>
      <ul className="ContactList">
        <li>Email: contact@anastacia.com</li>
        <li>Phone: (555) 555-5555</li>
        <li>Address: Tel-Aviv, Israel</li>
      </ul>
    </div>
  );
};

export default AboutUs;
