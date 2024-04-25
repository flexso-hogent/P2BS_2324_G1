namespace P2_BSP_G1.db;

entity Gebruikers {
    key gebruikerID   : UUID @key;
        voornaam      : String;
        achternaam    : String;
        email         : String;
        wachtwoord    : String @UI.Hidden;
        geboortedatum : Date;
        rol           : String;
        inschrijvingen: Association to many Inschrijvingen
                            on inschrijvingen.gebruikerID = $self;
}

entity Evenementen {
    key evenementID             : Integer @cds.autoinc;
        naam                    : String;
        beginDatum              : Date;
        eindDatum               : Date;
        beginUur                : Time;
        eindUur                 : Time;
        locatie                 : String;
        maxAantalInschrijvingen : Integer;
        prijs                   : Decimal(5, 2);
        sessies                 : Association to many Sessies
                                      on sessies.evenement = $self;
}

entity Sessies {
    key sessieID       : Int64;
        naam           : String;
        datum          : Date;
        beginUur       : Time;
        eindUur        : Time;
        spreker        : String;
        korteInhoud    : String;
        evenement      : Association to Evenementen;
        inschrijvingen : Association to many Inschrijvingen
                             on inschrijvingen.sessieID = $self;
}

entity Inschrijvingen {
    key inschrijvingID : Int64;
        gebruikerID    : Association to Gebruikers;
        sessieID       : Association to Sessies;
        score          : Association to Scores
                             on score.inschrijvingID = $self;
}

entity Scores {
    key scoreID        : Int64;
        gebruikerID    : Association to Gebruikers;
        inschrijvingID : Association to Inschrijvingen;
        aantalSterren  : Decimal(5);
        feedback       : String;
}
