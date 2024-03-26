using P2_BSP_G1.db as db from '../db/data-model';

service OverviewService {
    entity Gebruikers     as projection on db.Gebruikers;
    entity Evenementen    as projection on db.Evenementen;
    entity Inschrijvingen as projection on db.Inschrijvingen;
    entity Sessies        as projection on db.Sessies;
    entity Scores         as projection on db.Scores;
}
