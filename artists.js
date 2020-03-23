var request = require('request');
var cheerio = require('cheerio');
var nodeMailer = require('nodemailer');
let transporter;
let mailOptions;

//initialize 2 arrays; arr for top 25 artists; results for  a final list of artists
var arr = [];
var results=[];
var song=[];

request('https://www.ranker.com/list/best-rap-songs-2019/ranker-music', function (error, response, html) {
	if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);

        //create an array of names entered from the command line
        var input = process.argv.slice(2);

        //scrape
        $('span.listItem__properties').each(function(i, element){
            
            //pull out top 25 artists and remove space -> artists of each song are put in arrays
            var data = $(this).text().split(' ');

            //combine all arrays into a big array -> Array of subarrays
            arr.push(data)
        });


        //Loop through the big array    
        for(var m = 0; m < arr.length; m++) {
            var subArray = arr[m];
            //Loop through each subarray
                for(var n = 0; n < subArray.length; n++) {
                    //Find common artist names between input and subarrays
                    for (var x =0; x< input.length; x++) {
                        if (input[x] == subArray[n]) {
                            $('a.listItem__title').each(function(i, element) {
                                if (i==m) {song = $(this).text()};
                            });
                            console.log(song);
                            //results.push(subArray[n]);
                        

                            
                            //Send email
                            transporter = nodeMailer.createTransport({
                                host: 'smtp.gmail.com',
                                port: 465,
                                secure: true,
                                auth: {
                                    user:'linhhuynhasm5@gmail.com',
                                    pass: 'test112233!'
                                },
                                //remove error of certifications
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });
            
                            mailOptions ={
                                from: '"Linh Huynh" <linhhuynhasm5@gmail.com>',
                                to: 'lynnewong18@gmail.com',
                                subject: 'Your artist(s) are: ' + subArray,
                                text: '',
                                html: '<strong>'+ subArray + ': <em>' + song +'</em></strong>',
                            };
                            
                            transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log('Email sent: ' + info.response);
                                }
                              });

                            }
                            
                    } }
                } 
    };
})
