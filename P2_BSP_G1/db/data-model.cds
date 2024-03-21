namespace P2_BSP_G1.db;

entity Gebruikers {
    key gebruikerID   : Integer;
        voornaam      : String;
        achternaam    : String;
        email         : String;
        wachtwoord    : String;
        geboortedatum : Date;
}

entity Evenementen {
    key evenementID             : Integer;
        naam                    : String;
        beginDatum              : Date;
        eindDatum               : Date;
        beginUur                : Time;
        eindUur                 : Time;
        locatie                 : String;
        MaxAantalInschrijvingen : Integer;
        prijs                   : Decimal(5, 2);
        sessies                 : Association to many Sessies
                                      on sessies.evenement = $self;
}

entity Sessies {
    key sessieID       : Integer;
        naam           : String;
        datum          : Date;
        beginUur       : Time;
        eindUur        : Time;
        spreker        : String;
        korteInhoud    : String;
        evenement      : Association to Evenementen;
        inschrijvingen : Association to many Inschrijvingen
                             on inschrijvingen.sessieID = $self;
        scores         : Association to many Scores
                             on scores.sessieID = $self;
}

entity Inschrijvingen {
    key inschrijvingID : Integer;
        gebruikerID    : Association to Gebruikers;
        sessieID       : Association to Sessies;
}

entity Scores {
    key scoreID       : Integer;
        gebruikerID   : Association to Gebruikers;
        sessieID      : Association to Sessies;
        aantalSterren : Decimal(5);
        feedback      : String;
}
