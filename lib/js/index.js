/*
 * Marco Pretelli 21/10/2013
 * 
 * Programma di prova per Iamboo.srl
 * 
*/

var employees; // qui finirà il vettore json
var buffer = []; //qui il buffer di stringhe per appendere le immagini al DOM
var number = 16; // qui il numero delle immagini da visualizzare
var prev = 16; //
var prevtag = "fly";
var tag = "fly"; //default tag

/*
 * function x () ;
 * 
 * la funzione x si auto runna ma può anche essere richiamata.
 * 
 * AUTO RUN : 
 * L'auto run serve quando si carica la pagina per la prima volta e prelevo le immagini dal flickr con un tag 
 * di dafault e un numero immagine de default.
 * 
 * RICHIAMO DA CODICE: 
 * Viene richiamata invece quando l'utente va a modificare il numero di immagini da visualizzare o il tag delle immagini,
 * quindi dovrò caricare soltanto le nuove immagini nel, mio contaniner html, ma non la pagina.
 * 
 * ALTRO:
 * la funzione salva su un array JSON tutti i dati delle immagini caricate
 * che quindi essere salvati su file o database o essere riutilizzati in run time.
*/
(function x() {
	$('#number').prop('disabled', true); 
	//disabilito l'input "Numero immagini" fin quando non ho caricato le immagini desiderate 
	
	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
	//acquisisco il json da flickr
	  $.getJSON( flickerAPI, {
	    tags: tag,
	    tagmode: "any",
	    format: "json"
	  }) // una volta aquisito il json ossia la funzione è .done() ...
	    .done(function( data ) {
	    	$("#images-container").empty();
	    	//svuoto il container delle immagini
	    	if(number<0){
    			number=0;
    			$("#number").val(0);
    		}
	    	if(number == 0){
	    		//se l'utente ha selezionato 0 immagini mostro un messaggio che indica che ha selezionato 0 immagini
	    		$("#load").finish().css({backgroundColor:"black"},100);
	    		$("message h3").text("No images Found"); 
	    		$("message").show();
	    		$("#images-container").hide();
	    		$('#number').prop('disabled', false);
	    		$('#text').prop('disabled', false);
	    		return false;
	    		} 
	    		if(number > 20){
	    			//se l'utente ha selezionato più di 20 immagini (ossia quelle contenute nell'album in questo caso)
	    			//reimposto il numero a 20 e riscrivo 20 nell'input type="number"
	    			number=20;
	    			$("#number").val(20);
	    			alert("In questo album sono presenti solo 20 immagini");
	    		}
	    	number --;//decremento di 1 dato che il ciclo andrà da 0 a max e non da 1 a max
	    	
	    	// per ogni elemento appendo un box contenente un immagine e una descrizione.
	    	//l'immagine è cliccabile e quando essa viene cliccata "appare" e "scompare" (ricliccando), la descrizione
	    	//dell'immagine stessa
	    	$("#load").css({"width":"0px"});
	    	//rimetto la barra del caricamento a 0
	    	
	      $.each( data.items, function( i, item ) {
	        $( "<div class='superbox'><img class='image' src = '"+ item.media.m  +"'><div class='box'>Author: "+ item.author +"<br><a href='"+ item.link +"' target='_blank'>About us</a></div>" ).appendTo( "#images-container" );
	        buffer.push( item.media.m ); 
	        buffer.push( item.author );
	        buffer.push( item.link );
	        //(OPZIONALE) salvo in un buffer i dati da flickr (ossia gli url delle immagini l'autore e il link in questo caso)
	        
	        $("#load").animate({"width":(100/(number+1))*(i+1)+"%"});     
	        //aggiorno la barra di caricamento di un tot ogni immagine caricata ... nello specifico : 
	        // 100/numero+1 mi da quante volte il numero ci sta in 100, che moltiplicato per il numero di immagine caricata
	        // a cui sono (+1 perche avevo decrementato prima) mi da la % del caricamento:
	        // esempio: 100/20 = 5 => 5 * 1(immagine) = 5% => 5*2(immagini) = 10% ... => 5 * 20(immagini) = 100%
	        
	        if ( i === number) {
	        	//$("</ul>").appendTo( "#images-container" );
	        	
	        	// (OPZIONALE) salvo i dati in un array json svuotando il buffer.
	        	// i dati sono ora pronti per essere salvati su database o file o essere riutilizzati se necessario
		        employees = [
		        { "Url" : buffer.pop() , "author" : buffer.pop() ,"about":buffer.pop()}, 
		        { "Url" : buffer.pop() , "author" : buffer.pop() ,"about":buffer.pop()}, 
		        { "Url" : buffer.pop() , "author" : buffer.pop() ,"about":buffer.pop()}, ]; 
		        //(NB:) ho fatto un esempio con 3 immagini, ovviamente posso salvarne quante ne voglio, anche tutte quante
		        //rendendo magari l'algoritmo dinamico di modo da salvare i dati in base al numero delle immagini
		        
		        $("#load").finish().css({backgroundColor:"black"},100);
		        //quando ha finito il caricamento rimetto la barra nera a indicare che non carico più dati
		        $("message").hide();
		        // nascondo il messaggio (di loading o di nessun file trovato)
		        $("#images-container").show();
		        // finito il caricamento delle foto  mostro il container delle foto
		        $('#number').prop('disabled', false);
		        $('#text').prop('disabled', false);
		        //riabilito adesso l'inserimento dell'utente denne due input type
		        number++;
		        return false;
	        }
	      
	      }); // finita anche questa funzione col .done()...
	    }).done(function(){
			$("#images-container .box").hide();
			//vado a nascondere le descrizioni delle immagini
			$("#images-container .image").click(function(){
				//quando clicco un immagine mostro la sua descrizione
				$(this).next().slideToggle(300);	
			});	
			
			$("#number").change(function(){
				/*quando cambio il valore (dal valore precendente) del numero di immagini ricarico le immagini da frickl
				* (NB:) si potrebbero caricare solo le immagini non caricate in precedenza e appenderle ma in questo esempio
				*ci accontenteremo di ricaricarle tutte.
				*/
				prev = number;
				number = $("#number").val();
				//setto il valore attuale al valore inserito dall'utente
				if(number!=prev){
					//se il confronto col precedente è diverso allora riccarico la barra e richiamo x per caricare le immagini
					$("#load").finish().css({backgroundColor:"#e74c3c"});
					x();
				}
			});
			
			$("#text").change(function(){
				//stesso discorso del cambiamento del valore (number) soltanto per i tag per la ricerca delle immagini
				prevtag = tag;
				tag = $("#text").val();
				if(tag!=prevtag){
					$("#load").finish().css({backgroundColor:"#e74c3c"});
				x();
			}
			});
	  })	  
	  })();
var fleep = 1;
$(document).ready(function() {
	
	$("#images-container").hide();
	
	$("p").hide();
	// quando il DOM è pronto, nascondo le info del sito
	
	$("h1").click(function(){
		//quando clicco sul titolo mostro le info e le posso rinascondere ri cliccando di nuovo
		$(this).next().slideToggle(300);	
	});	
	
	$("#load").animate({"width":"100%"}, 1000);
	
	$("#nascondi").click(function(){
		if(fleep==1){
			$("#nascondibile").hide(333);
			$(this).css({backgroundColor:"rgba(230, 119, 119, 0.59)","color":"rgb(255, 69, 69)"});
			$(this).text("show");
			fleep = 0;
		}else{
			$("#nascondibile").show(333);
			$(this).css({backgroundColor:"rgba(190, 230, 119, 0.59)","color":"yellowgreen"});
			$(this).text("hide");
			fleep = 1;
		}	
	});
});
