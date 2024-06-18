import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import { Connection, Request, TYPES } from 'tedious';
import fetch from 'node-fetch';

const app = express();

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
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.send("API IS RUNNING");
});

async function importDataToDB(jsonData) {
    return new Promise((resolve, reject) => {
        const connection = new Connection(config);

        connection.on('connect', (err) => {
            if (err) {
                console.error('Connection error:', err.message);
                reject(err);
                return;
            }
            console.log('Connection established');

            (async () => {
                try {
                    for (const data of jsonData) {
                        await new Promise((resolve, reject) => {
                            const insertRequest = new Request(`
                                INSERT INTO Fact (photos, employeeCode, employeeCard, prefix, firstName, lastName, employeeName, prefixAlt, firstNameAlt, lastNameAlt, employeeNameAlt, nickName, joinDate, serviceDate, endProbationDate, endDate, quitReason, companyCode, company, establishmentCode, establishment, positionDate, jobroleCode, jobrole, positionCode, positionName, employeelevelCode, employeelevel, employeelevelNo, locationCode, location, organizationCode, organization, combinationCode, combination, suppervisorCode, suppervisor, workEmails, workPhones, workAddresses, birthDate, homeEmails, homePhones, mobilePhones, homeAddresses, nationID, expiredate)
                                VALUES (@photos, @employeeCode, @employeeCard, @prefix, @firstName, @lastName, @employeeName, @prefixAlt, @firstNameAlt, @lastNameAlt, @employeeNameAlt, @nickName, @joinDate, @serviceDate, @endProbationDate, @endDate, @quitReason, @companyCode, @company, @establishmentCode, @establishment, @positionDate, @jobroleCode, @jobrole, @positionCode, @positionName, @employeelevelCode, @employeelevel, @employeelevelNo, @locationCode, @location, @organizationCode, @organization, @combinationCode, @combination, @suppervisorCode, @suppervisor, @workEmails, @workPhones, @workAddresses, @birthDate, @homeEmails, @homePhones, @mobilePhones, @homeAddresses, @nationID, @expiredate);
                            `, err => {
                                if (err) {
                                    console.error('Insert error:', err.message);
                                    reject(err);
                                    return;
                                }
                                console.log('Data inserted successfully');
                                resolve();
                            });

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
                            insertRequest.addParameter('joinDate', TYPES.Date, data["joinDate"]); // Assuming data["joinDate"] is in a valid date format
                            insertRequest.addParameter('serviceDate', TYPES.Date, data["serviceDate"]); // Assuming data["serviceDate"] is in a valid date format
                            insertRequest.addParameter('endProbationDate', TYPES.Date, data["endProbationDate"]); // Assuming data["endProbationDate"] is in a valid date format
                            insertRequest.addParameter('endDate', TYPES.Date, data["endDate"]); // Assuming data["endDate"] is in a valid date format
                            insertRequest.addParameter('quitReason', TYPES.VarChar, data["quitReason"]);
                            insertRequest.addParameter('companyCode', TYPES.VarChar, data["companyCode"]);
                            insertRequest.addParameter('company', TYPES.VarChar, data["company"]);
                            insertRequest.addParameter('establishmentCode', TYPES.VarChar, data["establishmentCode"]);
                            insertRequest.addParameter('establishment', TYPES.VarChar, data["establishment"]);
                            insertRequest.addParameter('positionDate', TYPES.Date, data["positionDate"]); // Assuming data["positionDate"] is in a valid date format
                            insertRequest.addParameter('jobroleCode', TYPES.VarChar, data["jobroleCode"]);
                            insertRequest.addParameter('jobrole', TYPES.VarChar, data["jobrole"]);
                            insertRequest.addParameter('positionCode', TYPES.VarChar, data["positionCode"]);
                            insertRequest.addParameter('positionName', TYPES.VarChar, data["positionName"]);
                            insertRequest.addParameter('employeelevelCode', TYPES.VarChar, data["employeelevelCode"]);
                            insertRequest.addParameter('employeelevel', TYPES.VarChar, data["employeelevel"]);
                            insertRequest.addParameter('employeelevelNo', TYPES.VarChar, data["employeelevelNo"]);
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
                            insertRequest.addParameter('birthDate', TYPES.Date, new Date(data["birthDate"])); // Convert birthDate string to Date object
                            insertRequest.addParameter('homeEmails', TYPES.VarChar, data["homeEmails"]);
                            insertRequest.addParameter('homePhones', TYPES.VarChar, data["homePhones"]);
                            insertRequest.addParameter('mobilePhones', TYPES.VarChar, data["mobilePhones"]);
                            insertRequest.addParameter('homeAddresses', TYPES.VarChar, data["homeAddresses"]);
                            insertRequest.addParameter('nationID', TYPES.VarChar, data["nationID"]);
                            insertRequest.addParameter('expiredate', TYPES.Date, new Date(data["expiredate"])); // Convert expiredate string to Date object

                            connection.execSql(insertRequest);
                        });
                    }
                } catch (error) {
                    console.error('Error during SQL execution:', error.message);
                    reject(error);
                } finally {
                    connection.close();
                    console.log('Connection closed');
                    resolve();
                }
            })();
        });

        connection.on('error', (err) => {
            console.error('SQL connection error:', err.message);
            reject(err);
        });

        connection.connect();
    });
}

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

            page++;
        } while (page != totalPage);

        await importDataToDB(results);
        res.status(200).json({ results });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('An error occurred');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log("API Running on port : ", port);
});
