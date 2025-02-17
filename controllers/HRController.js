// const TransactionDB=require('../models/Transaction')
const nodemailer = require('nodemailer')
const UsersEmployer=require('../models/UsersEmployer')
const UsersContractor=require('../models/UsersContractor')
const addressModel = require('../models/Address')
const Bank = require('../models/Bank')
const Languages = require('../models/languageUser')
const JobsType = require('../models/JobType')
//const UsersHR=require('../models/UsersHR')
const Transaction=require('../models/Transaction')



const handleErrors = (err) => {
    console.log(err.message)
    let errors = { email: '', password: '' ,firstName: '', lastName: '',phoneNumber: '',city:''}

    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not incorrect'
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect'
    }

    if(err.message === 'incorrect firstName'){
        errors.firstName = 'That first is incorrect'
    }
    // duplicate email error
    if (err.code === 11000) {
        errors.email = 'that email is already registered'
        return errors}

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

module.exports.homepageHRGet=async (req,res)=> {
    const experienceContractorResult = await UsersContractor.find({})
    var countOfContractors = experienceContractorResult.length
    const maleContractorResult = await UsersContractor.find({gender: 'male'})
    const femaleContractorResult = await UsersContractor.find({gender: 'female'})
    var male1 = maleContractorResult.length
    var female1 = femaleContractorResult.length
    //
    console.log(male1 * 100)
    console.log(male1 * 100 / countOfContractors)
    var male = male1 * 100 / countOfContractors
    var female = female1 * 100 / countOfContractors

    const gender = {'male': male, 'female': female}


    var maxx5 = 0, maxx15 = 0, maxx30 = 0, maxx1 = 0

    for (var i = 0; i < experienceContractorResult.length; ++i) {
        if (experienceContractorResult[i].experience >= 0 && experienceContractorResult[i].experience <= 5)
            ++maxx5
        else if (experienceContractorResult[i].experience >= 6 && experienceContractorResult[i].experience <= 15)
            ++maxx15
        else if (experienceContractorResult[i].experience >= 16 && experienceContractorResult[i].experience <= 30)
            ++maxx30
        else
            ++maxx1

    }

    var max5 = maxx5 * 100 / countOfContractors
    var max15 = maxx15 * 100 / countOfContractors
    var max30 = maxx30 * 100 / countOfContractors
    var max1 = maxx1 * 100 / countOfContractors
    const dictexperience = {'max5': max5, 'max15': max15, 'max30': max30, 'max1': max1}

    var babyy = 0, ironn = 0, cleann1 = 0, gardenn = 0, cookk = 0, pett = 0


    for (i = 0; i < experienceContractorResult.length; ++i) {
        const arrayjob = experienceContractorResult[i].jobTypes

        for (var j = 0; j < arrayjob.length; ++j) {

            if (arrayjob[j].value == 'babysitting')
                ++babyy
            else if (arrayjob[j].value == 'ironing')
                ++ironn
            else if (arrayjob[j].value == 'cleaning')
                ++cleann1
            else if (arrayjob[j].value == 'cooking')
                ++cookk
            else if (arrayjob[j].value == 'gardening')
                ++gardenn
            else
                ++pett
        }


    }
    var baby = babyy * 100 / countOfContractors
    var iron = ironn * 100 / countOfContractors
    var clean1 = cleann1 * 100 / countOfContractors
    var garden = gardenn * 100 / countOfContractors
    var cook = cookk * 100 / countOfContractors
    var pet = pett * 100 / countOfContractors

    const dictjob = {'baby': baby, 'iron': iron, 'clean1': clean1, 'cook': cook, 'garden': garden, 'pet': pet}


    const eleContractorResult = await UsersContractor.find({education: 'elementary'})
    const highContractorResult = await UsersContractor.find({education: 'high school'})
    const higherContractorResult = await UsersContractor.find({education: 'higher'})
    var elementaa = eleContractorResult.length
    var highh = highContractorResult.length
    var higherr = higherContractorResult.length

    var elementa = elementaa * 100 / countOfContractors
    var high = highh * 100 / countOfContractors
    var higher = higherr * 100 / countOfContractors

    const diceducation = {'elementary': elementa, 'highSchool': high, 'higher': higher}


    res.render('homepageHR', {gender, dictexperience, dictjob, diceducation})


    module.exports.homepageHRGet = (req, res) => {
        res.render('homepageHR')
    }
}
    module.exports.attendanceclockHRGet = async (req, res) => {

        const transcationResult = await Transaction.find({})
        const userContractorResult = await UsersContractor.find({})

        const myObject = []

        for (var i = 0; i < transcationResult.length; i++) {
            for (var j = 0; j < userContractorResult.length; j++) {
                if (String(transcationResult[i].idContractor) == String(userContractorResult[j]._id)) {
                    var contractor = userContractorResult[j].email
                }
            }
            var transactionId = transcationResult[i]._id
            var date = transcationResult[i].date
            var startHourShift = convertNumToHour(transcationResult[i].startHourShift)
            var endHourShift = convertNumToHour(transcationResult[i].endHourShift)
            var startHourRec = convertNumToHour(transcationResult[i].startHourRec)
            var endHourRec = convertNumToHour(transcationResult[i].endHourRec)
            myObject.push({
                'transactionId': transactionId,
                'contractor': contractor,
                'date': date,
                'startHourShift': startHourShift,
                'endHourShift': endHourShift,
                'startHourRec': startHourRec,
                'endHourRec': endHourRec
            })
        }

        // console.log(myObject)

        res.render('attendanceClockHR', {data: myObject})
    }

    module.exports.attendanceclockHRPost = async (req, res) => {
        const {id, startMin, endMin} = req.body
        console.log(startMin)
        console.log(endMin)
        console.log(id)
        await Transaction.findById(id)
            // eslint-disable-next-line no-unused-vars
            .then(async result => {
                await Transaction.updateOne({_id: id},
                    {
                        startHourShift: startMin,
                        endHourShift: endMin,
                        isShifted: true
                    },).then(async updatedRows => {
                    console.log(updatedRows)
                    // res.redirect('/attendanceClockHR')
                    console.log(result.idContractor)
                    await UsersContractor.findById(result.idContractor).then(con => {
                        console.log(con.email)
                        sendEmail(con.email,'Shift updated', 'Hi there!' + con.email + '\nWe updated your shift to ' + convertNumToHour(startMin) + ' to ' + convertNumToHour(endMin) + 'in date: ' + result.date.toLocaleDateString())
                    })

                    res.status(201).json({msg: 'The shift was changed successfully'})

                }).catch(err => {
                    res.status(400).json({msgError: 'an error occurred Try again'})
                    console.log(err)

                })

            }).catch(err => {
                console.log(err)
            })


    }

    function sendEmail(email,subject, msg) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'hssce2021@gmail.com',
                pass: 'lamasce?'
            }
        })

        let mailOptions = {
            from: 'hssce2021@gmail.com',
            to: email,
            subject: subject,
            text: msg
        }


        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
    }

    module.exports.attendanceclockHRDelete = (req, res) => {
        const id = req.params.id
        console.log('here in HRController')
        console.log(id)
        Transaction.findByIdAndDelete(id)
            // eslint-disable-next-line no-unused-vars
            .then(result => {

                res.json({redirect: '/attendanceClockHR'})
            })
            .catch(err => {
                console.log(err)
            })

        const cont = Transaction.findById(id)
        // console.log("cont")
        console.log(cont)
        UsersContractor.calcAvg(cont.idContractor)
    }


    function convertNumToHour(num) {
        var hours = String(Math.floor(num / 60))

        if (hours.length < 2) {
            hours = '0' + String(hours)
        }

        var minutes = String(num % 60)

        if (minutes.length < 2) {
            minutes = '0' + String(minutes)
        }

        var result = hours + ':' + minutes

        if (String(result) == 'NaN:NaN') {
            result = 'no report'
        }

        return result
    }

    module.exports.addAContractorHRGet = (req, res) => {
        res.render('addAContractorHR')
    }


///////////////\\\\\\\\\\\\\\\\\\\\\\
    module.exports.monitorHiringHRGet = async (req, res) => {
        const transcationResult = await Transaction.find({})
        const userEmployerResult = await UsersEmployer.find({})
        const userContractorResult = await UsersContractor.find({})

        const myObject = []

        for (var i = 0; i < transcationResult.length; i++) {
            if (transcationResult[i].isShifted) {
                for (var j = 0; j < userContractorResult.length; j++) {
                    if (String(transcationResult[i].idContractor) == String(userContractorResult[j]._id)) {
                        var worker = userContractorResult[j].email

                        // var jobType = 'remind myself to change it'
                    }

                }

                var jobType = String(transcationResult[i].jobType)

                for (var k = 0; k < userEmployerResult.length; k++) {
                    if (String(transcationResult[i].idEmployer) == String(userEmployerResult[k]._id)) {
                        var employer = userEmployerResult[k].email
                    }
                }
                if (String(employer) != String(undefined)) {
                    var dateTransaction = transcationResult[i].date
                    var currentFee = Math.round(((transcationResult[i].endHourShift - transcationResult[i].startHourShift) / 60) * transcationResult[i].hourlyRate)
                    if (String(currentFee) == 'NaN') {
                        currentFee = 'shift was not reported yet'
                    }
                    myObject.push({
                        'worker': worker,
                        'jobType': jobType,
                        'employer': employer,
                        'date': dateTransaction,
                        'currentFee': currentFee
                    })
                }
            }

        }

        // console.log(myObject)
        res.render('monitorHiringHR', {data: myObject})
    }
///////////////\\\\\\\\\\\\\\\\\\\\\\

//at the end- delete!!!!!!!!

//const mongoose = require('mongoose')
    module.exports.transactionPost = async (req, res) => {

        let emp
        let con

        await UsersContractor.findById('6086f2955bd8042aa0a21160')
            .then(user => {
                //console.log(user)
                con = user
            })
        await UsersEmployer.findById('607fd32da1a5c01f3cbb028c')
            .then(user => {
                //console.log(user)
                emp = user
            })

        const x = {
            idContractor: con._id,
            idEmployer: emp._id,
            date: new Date(),
            hourlyRate: 100,
            startHourRec: 100,
            endHourRec: 1220

        }


        //const x=req.body
        try {
            const transaction = await Transaction.create(x)
            res.status(201).json(transaction)
        } catch (err) {
            console.log(err)
            // const errors = handleErrors(err)
            res.status(400).json({err})
        }

    }

    module.exports.addAContractorHRPost = async (req, res) => {

        try {
            const {
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                city,
                street,
                houseNumber,
                branch,
                accountNumber,
                bankName,
                gender,
                arrLang,
                education,
                smoker,
                experience,
                hourlyRate,
                picture,
                form101,
                birthday,
                aboutMe,
                arrTypeJob
            } = req.body


            var jobTypes = []
            for (var i = 0; i < arrTypeJob.length; i++) {
                jobTypes.push(await JobsType.create({value: arrTypeJob[i]}))
            }

            var languages = []
            for (i = 0; i < arrLang.length; ++i) {
                languages.push(await Languages.create({value: arrLang[i]}))
            }


            const address = new addressModel({city, street, houseNumber})
            const bank = new Bank({branch, accountNumber, bankName})
            // var myData = new UsersContractor({
            //     email, password, firstName, lastName, phoneNumber, address, bank,
            //     gender, languages, education, smoker, experience, hourlyRate, picture, form101, birthday, aboutMe, jobTypes
            // })
            var myData =
                {
                    email,
                    password,
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    bank,
                    gender,
                    languages,
                    education,
                    smoker,
                    experience,
                    hourlyRate,
                    picture,
                    form101,
                    birthday,
                    aboutMe,
                    jobTypes
                }


            const user = await UsersContractor.create(myData)
            res.status(201).json({user})

            // await myData.save(function (err,doc){
            //     if(err)
            //         console.log(err.message)
            //      else{
            //          res.status(200).json({doc})
            //     }
            //  })

            // console.log(myData + 'mydata')
            //הדפסה לעובד קבלן שעובד טוב


            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'hssce2021@gmail.com',
                    pass: 'lamasce?'
                }
            })

            var mailOptions = {
                from: 'hssce2021@gmail.com',
                to: req.body.email,
                subject: 'registered successfully',
                html: '<h1>Welcome</h1>' +
                    '<h3>Hope you find a good job</h3>' +
                    '<h3>Thanks, HouseHold</h3>'
            }

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error)
                } else {
                    console.log('Email sent: ' + info.response)
                }
            })



        } catch (e) {
            const errors = handleErrors(e)
            res.status(400).json({errors})
        }
    }
