**TDDC73 - Projekt**
*av:* 
Arvid Fredriksson (arvfr173)

*Vad:*
Pull to refresh och Carousel

*Varför:*
Carousel är ett design pattern som ger möjligheten att scrolla mellan objekt i en lista på ett naturligt sätt, samtidigt som användarens fokus riktas mot ett eller ett fåtal av objekten åt gången. 

Pull to refresh (RefreshDrag) är ett design pattern för att uppdatera eller hämta ny data genom att dra ned innehållet från toppen av sidan

*Hur:*
Carousel är i grund och botten en lista av godtyckliga objekt som bläddras igenom horisontellt. Obligatoriska props är:
* `data: T[]` -  Den underliggande listan av objekt.
* `itemWidth: number` -  Bredden på varje objekt som rendreras. Denna är obligatorisk för att bläddringslogiken använder sig av bredden för att snäppa till ett objekt i taget och sätta det som det nuvarande valda objektet.
* `renderItem: (item: T, index: number) => React.ReactNode` - Innehåller de komponenter som ska rendreras utifrån objekten i `data`.

Resterande props är valfria och kan utelämnas, varpå default-värden används. De kan också överskrivas för att anpassa komponenten utifrån användningsområde eller önskad design. Dessa är: 
* `itemHeight: number` - Höjden på varje objekt.
* `itemSpacing: number`- Utrymmet mellan objekten.
* `carouselStyle: StyleProp<ViewStyle>` - Styling för hela Carousel-komponenten.
* `itemStyle: StyleProp<ViewStyle>` - Styling för varje objekt i listan.
* `indicators: IndicatorProps` - Ytterligare props för design av indaikatorer för vilket objekt som visas. 

Interfacet `IndicatorProps` består av dessa props:
* `visible: boolean` - Bestämmer om inkatorer ska visas. Är `true` som default. 
* `containerStyle: StyleProp<ViewStyle>` - Styling för hela indikator-containern.
* `indicatorStyle: StyleProp<ViewStyle>` - Styling för varje indikator.
* `activeStyle: StyleProp<ViewStyle>` - Styling för indikatorn som motsvarar det valda objektet i listan.


RefreshDrag läggs som en wrapper runt innehåll som man vill skrolla igenom i ett vertikalt flöde. Vid toppen av flödet kan innehållet dras nedåt för att trigga en funktion, vanligtvis för att hämta nytt innehåll eller uppdatera sidan. Den enda obligatoriska prop är:
* `onRefresh: () => Promise<void> | void` - Funktionen som kallas när innehållet dras ned. 

Resterande props har default-värden som kan överskrivas:
* `refreshHeight: number` - Höjden som behöver dras ned för att trigga en refresh
* `renderRefresh?: (pullProgress: number) => React.ReactNode` - Logik och styling för det som visas när innehållet dras ned. pullProgress är ett nummer mellan 0 och 1 som visar progress för neddragningen. Refresh triggas när dragningen avslutas vid `pullProgress == 1`. 
* `style: StyleProp<ViewStyle>` - Styling för hela komponenten
* `contentContainerStyle: StyleProp<ViewStyle>` - Styling för den ScrollView som RefreshDrag innehåller komponenten wrappar runt