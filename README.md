<h1 align="center" id="title">Login User</h1>

<p align="center"><img src="https://socialify.git.ci/hansyahridho07/login-user/image?description=1&amp;forks=1&amp;issues=1&amp;language=1&amp;name=1&amp;owner=1&amp;pulls=1&amp;stargazers=1&amp;theme=Light" alt="project-image"></p>

<p id="description">Service for register login and manage account</p>

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   Register
*   Login
*   Forget Password
*   Change Password
*   Update data user
*   Update status user
*   Check Authorization
*   Check Authentication
*   Send to email link for verification

<h2>DDL</h2>

```
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL DEFAULT (uuid()),
  `username` varchar(100) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `password` text,
  `email_confirmation` tinyint(1) DEFAULT '0',
  `status` tinyint(1) DEFAULT '0',
  `token_confirmation` varchar(36) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL,
  `type` enum('MANUAL','GOOGLE','ETC') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone_number` (`phone_number`)
);
```

<h2>🛠️ Installation Steps:</h2>

<p>1. Install node_modules</p>

```
npm install
```

<p>2. Run script</p>

```
npm run start
```

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Javascript
*   Express JS
*   Sequelize
*   MySQL
*   Jsonwebtoken
*   Bcrypt
*   Nodemailer