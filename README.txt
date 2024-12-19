 -------------------------------------------------------------------------------------------------
 											          
  	  Tento soubor obsahuje popis obsahu archivu a doplňující informace.		  	  
 												  
 -------------------------------------------------------------------------------------------------
 												  
	Autor : Michal Jireš (xjires02)								  
 	Zadání : Vyzualizace Bitcoin Scriptu		  					  
 	Rok : 2022										  
 												  
 -------------------------------------------------------------------------------------------------
 												  
 	V době odevzdávání je stránka dostupná na adrese :					  
 		https://www.stud.fit.vutbr.cz/~xjires02/BDA/bda.html				  
			  									  
 -------------------------------------------------------------------------------------------------
 												  
 	Obsah paměťového média :								  
 	|- src-proxy ------------------------------	Obsahuje php skript umístěný na serveru.  
 		|- proxy.php ----------------------	Skript, který dělá API proxy.		  
 	|- src-web --------------------------------	Obsahuje zdrojové soubory stránky.	  
 		|- styles -------------------------	Složka obsahující ikony a soubor css.	  
 		|- alterGUI.js --------------------	Obsahuje funkce pro práci s GUI.	  
 		|- bda.html -----------------------	HTML soubor stránky.			  
		|- btc-script.js ------------------	Obsahuje funkce pro interpretaci scriptu. 
 		|- crypto-js.min.js ---------------	Použitá knihovna pro kryptografii.	  
 		|- main.js ------------------------	Obsahuje funkce pro získávání dat.	  
 	|- README.txt -----------------------------	Soubor obsahující doplňující informace.	  
 	|- xjires02.pdf ---------------------------	Text dokumentace práce.	  		  
 												  
 -------------------------------------------------------------------------------------------------
 												  
 	Návod na spuštění :									  
 	Pro spuštění stačí navštívit stránku zmíněnou výše. Pokud již stránka neexistuje,	  
 	je zapotřebí otevřít soubor bda.html a zadat ID tansakce. Stránka využívá tři internetové 
	servery, u kterých nelze zajistit jejich dostupnost. Pokud nefunguje stránka zmíněná výše 
	je také velice pravděpodobné, že nebude fungovat ani proxy umístěná na serveru Eva. Je    
	zapotřebí umístit proxy na nějaký server a nebo použít proxy jinou. Při změně adresy proxy
	se musí upravit proměnné url ve funkci sendRequest() v souboru main.js.	 		  
												  
	Většina testování byla prováděna v prohlížeči Firefox.					  
												  
 -------------------------------------------------------------------------------------------------