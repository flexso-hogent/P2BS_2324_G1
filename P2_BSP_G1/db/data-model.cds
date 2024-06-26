namespace P2_BSP_G1.db;

entity Gebruikers {
    key gebruikerID   : Integer @cds.autoinc;
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
        prijs                   : Decimal(5, 2);
        actief                  : Boolean;
        sessies                 : Association to many Sessies
                                      on sessies.evenement = $self;
}

entity Sessies {
    key sessieID       : Integer @cds.autoinc;
        naam           : String;
        datum          : Date;
        beginUur       : Time;
        eindUur        : Time;
        spreker        : String;
        korteInhoud    : String;
        maxAantalInschrijvingen : Integer;
        evenement      : Association to Evenementen;
        inschrijvingen : Association to many Inschrijvingen
                             on inschrijvingen.sessieID = $self;
}

entity Inschrijvingen {
    key inschrijvingID : Integer @cds.autoinc;
        gebruikerID    : Association to Gebruikers;
        sessieID       : Association to Sessies;
        score          : Association to Scores
                             on score.inschrijvingID = $self;
}

entity Scores {
    key scoreID        : Integer @cds.autoinc;
        gebruikerID    : Association to Gebruikers;
        inschrijvingID : Association to Inschrijvingen;
        aantalSterren  : Decimal(5);
        feedback       : String;
}
