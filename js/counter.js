




var timezone = new Date()
var gmtHours = -timezone.getTimezoneOffset()/60;
month		 = --month;
dateFuture   = new Date(year,month,day,hour-gmtHours,min,sec);

function countProcess(){

        dateNow = new Date();                                                            
        amount  = dateFuture.getTime() - dateNow.getTime()+5;               
        delete dateNow;

        /* time is already past */
        if(amount < 0){
                output ="<div id='days'><span></span>0<div id='days_text'></div></div>" + 
						"<div id='hours'><span></span>0<div id='hours_text'></div></div>" + 
						"<div id='mins'><span></span>0<div id='mins_text'></div></div>" + 
						"<div id='secs'><span></span>0<div id='secs_text'></div></div>" ;
                $('#countbox').html(output);    
        }
        /* date is still good */
        else{
                days=0; hours=0; mins=0; secs=0; output="";

                amount = Math.floor(amount/1000); /* kill the milliseconds */

                days   = Math.floor(amount/86400); /* days */
                amount = amount%86400;

                hours  = Math.floor(amount/3600); /* hours */
                amount = amount%3600;

                mins   = Math.floor(amount/60); /* minutes */
                amount = amount%60;

                
                secs   = Math.floor(amount); /* seconds */


                output="<div id='days'><span></span>" + days +"<div id='days_text'></div></div>" + 
						"<div id='hours'><span></span>" + hours +"<div id='hours_text'></div></div>" + 
						"<div id='mins'><span></span>" + mins +"<div id='mins_text'></div></div>" + 
						"<div id='secs'><span></span>" + secs +"<div id='secs_text'></div></div>" ;
						
				$('#countbox').html(output);
			

                setTimeout("countProcess()", 1000);
        }
		
}
