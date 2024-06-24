// All Library Section
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { Connection, Request, TYPES } from 'tedious';
import fetch from 'node-fetch';

// Express Set up
const app = express();

// Config SQL setup
const config = {
    authentication: {
        options: {
            userName: 'API-DBALogin',
            password: 'API-DBALogin#123'
        },
        type: 'default'
    },
    server: 'BKKSRV20.oceanglass.com',
    options: {
        database: 'API',
        encrypt: true,
        trustServerCertificate: true
    }
};

const server = http.createServer(app);

// Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Verify that API is running
app.get("/", (req, res) => {
    res.send("API IS RUNNING");
});

// Function to import data to DB with update functionality
async function importDataToDB(jsonData) {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);

        connection.on('connect', async (err) => {
            if (err) {
                console.error('Connection error:', err.message);
                reject(err);
                return;
            }
            console.log('Connection established');

            try {
                for (const data of jsonData) {
                    await new Promise((resolve, reject) => {
                        const checkRequest = new Request(`
                            SELECT 1 FROM Fact WHERE nationID = @nationID
                        `, (err, rowCount) => {
                            if (err) {
                                console.error('Check error:', err.message);
                                reject(err);
                                return;
                            }

                            if (rowCount > 0) {
                                console.log('Data found, performing update');

                                const updateRequest = new Request(`
                                    UPDATE Fact SET 
                                    photos = @photos,
                                    employeeCode = @employeeCode,
                                    employeeCard = @employeeCard,
                                    prefix = @prefix,
                                    firstName = @firstName,
                                    lastName = @lastName,
                                    employeeName = @employeeName,
                                    prefixAlt = @prefixAlt,
                                    firstNameAlt = @firstNameAlt,
                                    lastNameAlt = @lastNameAlt,
                                    employeeNameAlt = @employeeNameAlt,
                                    nickName = @nickName,
                                    joinDate = @joinDate,
                                    serviceDate = @serviceDate,
                                    endProbationDate = @endProbationDate,
                                    endDate = @endDate,
                                    quitReason = @quitReason,
                                    companyCode = @companyCode,
                                    company = @company,
                                    establishmentCode = @establishmentCode,
                                    establishment = @establishment,
                                    positionDate = @positionDate,
                                    jobroleCode = @jobroleCode,
                                    jobrole = @jobrole,
                                    positionCode = @positionCode,
                                    positionName = @positionName,
                                    employeelevelCode = @employeelevelCode,
                                    employeelevel = @employeelevel,
                                    employeelevelNo = @employeelevelNo,
                                    locationCode = @locationCode,
                                    location = @location,
                                    organizationCode = @organizationCode,
                                    organization = @organization,
                                    combinationCode = @combinationCode,
                                    combination = @combination,
                                    suppervisorCode = @suppervisorCode,
                                    suppervisor = @suppervisor,
                                    workEmails = @workEmails,
                                    workPhones = @workPhones,
                                    workAddresses = @workAddresses,
                                    birthDate = @birthDate,
                                    homeEmails = @homeEmails,
                                    homePhones = @homePhones,
                                    mobilePhones = @mobilePhones,
                                    homeAddresses = @homeAddresses,
                                    expiredate = @expiredate
                                    WHERE nationID = @nationID
                                `, (err) => {
                                    if (err) {
                                        console.error('Update error:', err.message);
                                        reject(err);
                                        return;
                                    }
                                    console.log('Data updated successfully');
                                    resolve();
                                });

                                // Add parameters for update request
                                updateRequest.addParameter('photos', TYPES.VarChar, data["photos"]);
                                updateRequest.addParameter('employeeCode', TYPES.VarChar, data["employeeCode"]);
                                updateRequest.addParameter('employeeCard', TYPES.VarChar, data["employeeCard"]);
                                updateRequest.addParameter('prefix', TYPES.VarChar, data["prefix"]);
                                updateRequest.addParameter('firstName', TYPES.VarChar, data["firstName"]);
                                updateRequest.addParameter('lastName', TYPES.VarChar, data["lastName"]);
                                updateRequest.addParameter('employeeName', TYPES.VarChar, data["employeeName"]);
                                updateRequest.addParameter('prefixAlt', TYPES.VarChar, data["prefixAlt"]);
                                updateRequest.addParameter('firstNameAlt', TYPES.VarChar, data["firstNameAlt"]);
                                updateRequest.addParameter('lastNameAlt', TYPES.VarChar, data["lastNameAlt"]);
                                updateRequest.addParameter('employeeNameAlt', TYPES.VarChar, data["employeeNameAlt"]);
                                updateRequest.addParameter('nickName', TYPES.VarChar, data["nickName"]);
                                updateRequest.addParameter('joinDate', TYPES.DateTime, data["joinDate"] ? new Date(Number(data["joinDate"])) : null);
                                updateRequest.addParameter('serviceDate', TYPES.DateTime, data["serviceDate"] ? new Date(Number(data["serviceDate"])) : null);
                                updateRequest.addParameter('endProbationDate', TYPES.DateTime, data["endProbationDate"] ? new Date(Number(data["endProbationDate"])) : null);
                                updateRequest.addParameter('endDate', TYPES.DateTime, data["endDate"] ? new Date(data["endDate"]) : null);
                                updateRequest.addParameter('quitReason', TYPES.VarChar, data["quitReason"]);
                                updateRequest.addParameter('companyCode', TYPES.VarChar, data["companyCode"]);
                                updateRequest.addParameter('company', TYPES.VarChar, data["company"]);
                                updateRequest.addParameter('establishmentCode', TYPES.VarChar, data["establishmentCode"]);
                                updateRequest.addParameter('establishment', TYPES.VarChar, data["establishment"]);
                                updateRequest.addParameter('positionDate', TYPES.Date, data["positionDate"] ? new Date(Number(data["positionDate"])) : null);
                                updateRequest.addParameter('jobroleCode', TYPES.VarChar, data["jobroleCode"]);
                                updateRequest.addParameter('jobrole', TYPES.VarChar, data["jobrole"]);
                                updateRequest.addParameter('positionCode', TYPES.VarChar, data["positionCode"]);
                                updateRequest.addParameter('positionName', TYPES.VarChar, data["positionName"]);
                                updateRequest.addParameter('employeelevelCode', TYPES.VarChar, data["employeelevelCode"]);
                                updateRequest.addParameter('employeelevel', TYPES.VarChar, data["employeelevel"]);
                                updateRequest.addParameter('employeelevelNo', TYPES.Int, data["employeelevelNo"]);
                                updateRequest.addParameter('locationCode', TYPES.VarChar, data["locationCode"]);
                                updateRequest.addParameter('location', TYPES.VarChar, data["location"]);
                                updateRequest.addParameter('organizationCode', TYPES.VarChar, data["organizationCode"]);
                                updateRequest.addParameter('organization', TYPES.VarChar, data["organization"]);
                                updateRequest.addParameter('combinationCode', TYPES.VarChar, data["combinationCode"]);
                                updateRequest.addParameter('combination', TYPES.VarChar, data["combination"]);
                                updateRequest.addParameter('suppervisorCode', TYPES.VarChar, data["suppervisorCode"]);
                                updateRequest.addParameter('suppervisor', TYPES.VarChar, data["suppervisor"]);
                                updateRequest.addParameter('workEmails', TYPES.VarChar, data["workEmails"]);
                                updateRequest.addParameter('workPhones', TYPES.VarChar, data["workPhones"]);
                                updateRequest.addParameter('workAddresses', TYPES.VarChar, data["workAddresses"]);
                                updateRequest.addParameter('birthDate', TYPES.DateTime, data["birthDate"] ? new Date(Number(data["birthDate"])) : null);
                                updateRequest.addParameter('homeEmails', TYPES.VarChar, data["homeEmails"]);
                                updateRequest.addParameter('homePhones', TYPES.VarChar, data["homePhones"]);
                                updateRequest.addParameter('mobilePhones', TYPES.VarChar, data["mobilePhones"]);
                                updateRequest.addParameter('homeAddresses', TYPES.VarChar, data["homeAddresses"]);
                                updateRequest.addParameter('nationID', TYPES.VarChar, data["nationID"]);
                                updateRequest.addParameter('expiredate', TYPES.DateTime, data["expiredate"] ? new Date(Number(data["expiredate"])) : null);

                                connection.execSql(updateRequest);
                            } else {
                                console.log('Data not found, performing insert');

                                const insertRequest = new Request(`
                                    INSERT INTO Fact (photos, employeeCode, employeeCard, prefix, firstName, lastName, employeeName, prefixAlt, firstNameAlt, lastNameAlt, employeeNameAlt, nickName, joinDate, serviceDate, endProbationDate, endDate, quitReason, companyCode, company, establishmentCode, establishment, positionDate, jobroleCode, jobrole, positionCode, positionName, employeelevelCode, employeelevel, employeelevelNo, locationCode, location, organizationCode, organization, combinationCode, combination, suppervisorCode, suppervisor, workEmails, workPhones, workAddresses, birthDate, homeEmails, homePhones, mobilePhones, homeAddresses, nationID, expiredate)
                                    VALUES (@photos, @employeeCode, @employeeCard, @prefix, @firstName, @lastName, @employeeName, @prefixAlt, @firstNameAlt, @lastNameAlt, @employeeNameAlt, @nickName, @joinDate, @serviceDate, @endProbationDate, @endDate, @quitReason, @companyCode, @company, @establishmentCode, @establishment, @positionDate, @jobroleCode, @jobrole, @positionCode, @positionName, @employeelevelCode, @employeelevel, @employeelevelNo, @locationCode, @location, @organizationCode, @organization, @combinationCode, @combination, @suppervisorCode, @suppervisor, @workEmails, @workPhones, @workAddresses, @birthDate, @homeEmails, @homePhones, @mobilePhones, @homeAddresses, @nationID, @expiredate);
                                `, (err) => {
                                    if (err) {
                                        console.error('Insert error:', err.message);
                                        reject(err);
                                        return;
                                    }
                                    console.log('Data inserted successfully');
                                    resolve();
                                });

                                // Add parameters for insert request
                                insertRequest.addParameter('photos', TYPES.VarChar, data["photos"]);
                                insertRequest.addParameter('employeeCode', TYPES.VarChar, data["employeeCode"]);
                                insertRequest.addParameter('employeeCard', TYPES.VarChar, data["employeeCard"]);
                                insertRequest.addParameter('prefix', TYPES.VarChar, data["prefix"]);
                                insertRequest.addParameter('firstName', TYPES.VarChar, data["firstName"]);
                                insertRequest.addParameter('lastName', TYPES.VarChar, data["lastName"]);
                                insertRequest.addParameter('employeeName', TYPES.VarChar, data["employeeName"]);
                                insertRequest.addParameter('prefixAlt', TYPES.VarChar, data["prefixAlt"]);
                                insertRequest.addParameter('firstNameAlt', TYPES.VarChar, data["firstNameAlt"]);
                                insertRequest.addParameter('lastNameAlt', TYPES.VarChar, data["lastNameAlt"]);
                                insertRequest.addParameter('employeeNameAlt', TYPES.VarChar, data["employeeNameAlt"]);
                                insertRequest.addParameter('nickName', TYPES.VarChar, data["nickName"]);
                                insertRequest.addParameter('joinDate', TYPES.DateTime, data["joinDate"] ? new Date(Number(data["joinDate"])) : null);
                                insertRequest.addParameter('serviceDate', TYPES.DateTime, data["serviceDate"] ? new Date(Number(data["serviceDate"])) : null);
                                insertRequest.addParameter('endProbationDate', TYPES.DateTime, data["endProbationDate"] ? new Date(Number(data["endProbationDate"])) : null);
                                insertRequest.addParameter('endDate', TYPES.DateTime, data["endDate"] ? new Date(data["endDate"]) : null);
                                insertRequest.addParameter('quitReason', TYPES.VarChar, data["quitReason"]);
                                insertRequest.addParameter('companyCode', TYPES.VarChar, data["companyCode"]);
                                insertRequest.addParameter('company', TYPES.VarChar, data["company"]);
                                insertRequest.addParameter('establishmentCode', TYPES.VarChar, data["establishmentCode"]);
                                insertRequest.addParameter('establishment', TYPES.VarChar, data["establishment"]);
                                insertRequest.addParameter('positionDate', TYPES.Date, data["positionDate"] ? new Date(Number(data["positionDate"])) : null);
                                insertRequest.addParameter('jobroleCode', TYPES.VarChar, data["jobroleCode"]);
                                insertRequest.addParameter('jobrole', TYPES.VarChar, data["jobrole"]);
                                insertRequest.addParameter('positionCode', TYPES.VarChar, data["positionCode"]);
                                insertRequest.addParameter('positionName', TYPES.VarChar, data["positionName"]);
                                insertRequest.addParameter('employeelevelCode', TYPES.VarChar, data["employeelevelCode"]);
                                insertRequest.addParameter('employeelevel', TYPES.VarChar, data["employeelevel"]);
                                insertRequest.addParameter('employeelevelNo', TYPES.Int, data["employeelevelNo"]);
                                insertRequest.addParameter('locationCode', TYPES.VarChar, data["locationCode"]);
                                insertRequest.addParameter('location', TYPES.VarChar, data["location"]);
                                insertRequest.addParameter('organizationCode', TYPES.VarChar, data["organizationCode"]);
                                insertRequest.addParameter('organization', TYPES.VarChar, data["organization"]);
                                insertRequest.addParameter('combinationCode', TYPES.VarChar, data["combinationCode"]);
                                insertRequest.addParameter('combination', TYPES.VarChar, data["combination"]);
                                insertRequest.addParameter('suppervisorCode', TYPES.VarChar, data["suppervisorCode"]);
                                insertRequest.addParameter('suppervisor', TYPES.VarChar, data["suppervisor"]);
                                insertRequest.addParameter('workEmails', TYPES.VarChar, data["workEmails"]);
                                insertRequest.addParameter('workPhones', TYPES.VarChar, data["workPhones"]);
                                insertRequest.addParameter('workAddresses', TYPES.VarChar, data["workAddresses"]);
                                insertRequest.addParameter('birthDate', TYPES.DateTime, data["birthDate"] ? new Date(Number(data["birthDate"])) : null);
                                insertRequest.addParameter('homeEmails', TYPES.VarChar, data["homeEmails"]);
                                insertRequest.addParameter('homePhones', TYPES.VarChar, data["homePhones"]);
                                insertRequest.addParameter('mobilePhones', TYPES.VarChar, data["mobilePhones"]);
                                insertRequest.addParameter('homeAddresses', TYPES.VarChar, data["homeAddresses"]);
                                insertRequest.addParameter('nationID', TYPES.VarChar, data["nationID"]);
                                insertRequest.addParameter('expiredate', TYPES.DateTime, data["expiredate"] ? new Date(Number(data["expiredate"])) : null);

                                connection.execSql(insertRequest);
                                resolve();
                            }
                        });
                        checkRequest.addParameter('nationID', TYPES.VarChar, data["nationID"]);

                        connection.execSql(checkRequest);
                    });
                }
                connection.close();

            } catch (error) {
                console.error('Error during SQL execution:', error.message);
                reject(error);
            } finally {
                connection.close();
                console.log('Connection closed');
                resolve();
            }
        });

        connection.on('error', (err) => {
            console.error('SQL connection error:', err.message);
            reject(err);
        });

        connection.connect();
    });
}

// Endpoint for Fetching and Saving Data
app.get('/fetch-and-save', async (req, res) => {
    try {
        let results = [];
        let page = 1;
        let totalPage = 0;

        do {
            const url = `https://sabas.eunite.com/eunite/webservices/employees?dateV=01-04-2022&page=${page}&size=10`;
            const username = 'sa.trial_sabas01@eunite.com';
            const password = 'eUniteDemo@2023';
            const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                page = totalPage;
                throw new Error('Failed to fetch data');
            }

            const jsonData = await response.json();

            if (jsonData.result.length > 0) {
                results = [...results, ...jsonData.result];
                totalPage = jsonData.totalPage;
                console.log("results", results);
            } else {
                break;
            }
            if(page == 1){
                break;
            }
            

            page++;
        } while (page != totalPage);

        await importDataToDB(results);
        res.status(200).json({ results });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
});

// Default middleware
app.use(function (req, res, next) {
    next();
});

// Server setup and start
const port = 3000;
server.listen(port, () => {
    console.log("API Running on port:", port);
});
