
# Running the Nest Application

This document provides instructions for running the Nest application on a computer. Before you begin, please make sure that you have the necessary software and hardware requirements.

## Requirements

-   Operating System: Windows 10, MacOS, or Linux
-   Processor: Intel Core i5 or equivalent
-   RAM: 4 GB
-   Hard Drive: 500 GB
-   Software: Latest version of [Node.js](https://nodejs.org/en/download/) and [Nest CLI](https://docs.nestjs.com/cli/overview)

## Setup

1.  Clone the latest version of the application from the official repository.
2.  Open the terminal or command prompt and navigate to the cloned directory.
3.  Run the following command to install the necessary dependencies:

Copy code

`npm install`

4.  Create a new file named `.env` in the cloned directory.
5.  Open the `.env` file and add the following lines, replacing the placeholder values with your own values:



`DB_URI=mongodb://localhost/nest
JWT_SECRET=secretkey
JWT_EXPIRES=3600`

Note: `DB_URI` is the URL of your MongoDB database, `JWT_SECRET` is the secret key used to sign the JSON Web Tokens, and `JWT_EXPIRES` is the number of seconds after which the tokens will expire.

The `.env` file should be added to your `.gitignore` file to prevent sensitive information from being committed to the repository.

## Running the Application

1.  Open the terminal or command prompt and navigate to the cloned directory.
2.  Run the following command to start the application:



`nest start --watch`

## Troubleshooting

-   If you encounter any issues with the setup or running of the application, please refer to the documentation on the official website.
-   If the issue persists, feel free to raise an issue on the repository.# Running the Nest Application

This document provides instructions for running the Nest application on a computer. Before you begin, please make sure that you have the necessary software and hardware requirements.e an issue on the repository.


## Conclusion

We hope these instructions have helped you run the Nest application successfully. If you have any questions or need further assistance, please don't hesitate to reach out to me.

We appreciate your efforts in using this application and hope it brings value to your project. Have a great day!
