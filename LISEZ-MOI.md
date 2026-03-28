# Guide d'administration — Site Terre'Happy Cholet

Bienvenue dans le guide d'administration de votre site web.
Ce document explique comment effectuer les modifications courantes.

---

## STRUCTURE DU SITE

```
site-web/
├── index.html              ← Page d'accueil
├── equipe.html             ← Page équipe
├── actualites.html         ← Page actualités
├── location-salle.html     ← Page location de salle
├── contact.html            ← Page contact
├── mentions-legales.html   ← Mentions légales
├── mise-a-jour.html        ← Formulaire thérapeutes
├── sitemap.xml             ← Plan du site (SEO)
├── robots.txt              ← Instructions moteurs de recherche
├── .htaccess               ← Configuration serveur Apache
├── assets/
│   ├── css/style.css       ← Feuille de style principale
│   ├── js/main.js          ← JavaScript principal
│   └── images/             ← Images du site
└── therapeutes/
    ├── sophie-arnault/
    │   ├── index.html      ← Page de Sophie Arnault
    │   └── photo.webp      ← Photo de Sophie Arnault
    ├── lucie-boussard/
    │   ├── index.html
    │   └── photo.webp
    └── ... (un dossier par thérapeute)
```

---

## 1. CHANGER LA PHOTO D'UN THÉRAPEUTE

### Méthode simple
1. Préparez la nouvelle photo (format WebP ou JPG recommandé, minimum 400×400 px)
2. Renommez-la `photo.webp` (ou `photo.jpg`)
3. Remplacez le fichier existant dans le dossier correspondant :
   - Exemple pour Sophie Arnault : `therapeutes/sophie-arnault/photo.webp`

### Si vous utilisez FTP (OVH, hébergeur classique)
1. Connectez-vous à votre espace FTP
2. Naviguez jusqu'au dossier `therapeutes/NOM-DU-THERAPEUTE/`
3. Supprimez l'ancienne photo
4. Téléversez la nouvelle sous le nom `photo.webp`

### Conversion en WebP (optionnel mais recommandé)
- Utilisez https://squoosh.app/ pour convertir et optimiser vos images
- Ou https://convertio.co/fr/jpg-webp/

---

## 2. METTRE À JOUR LES INFORMATIONS D'UN THÉRAPEUTE

### Via le formulaire en ligne
1. Envoyez ce lien au thérapeute : `www.terrehappycholet.com/mise-a-jour.html?therapeute=NOM-DU-SLUG`
   - Exemple pour Sophie Arnault : `?therapeute=sophie-arnault`
   - Exemple pour Nancy Giraudeau : `?therapeute=nancy-giraudeau`
2. Le thérapeute remplit le formulaire
3. Vous recevez un email avec les nouvelles informations à `assoterrehappy1@gmail.com`
4. Mettez à jour le fichier HTML correspondant

### En éditant directement le HTML
1. Ouvrez le fichier `therapeutes/NOM-DU-THERAPEUTE/index.html` dans un éditeur de texte
2. Repérez les commentaires `<!-- NOM -->`, `<!-- SPECIALITE -->`, `<!-- DESCRIPTION -->`, `<!-- TELEPHONE -->`, etc.
3. Modifiez le contenu entre les balises HTML
4. Sauvegardez et re-déployez le fichier

**Exemple** — Pour changer le numéro de téléphone de Sophie Arnault :
Ouvrez `therapeutes/sophie-arnault/index.html`, cherchez `06.42.08.42.81` et remplacez par le nouveau numéro.

---

## 3. AJOUTER UN NOUVEAU THÉRAPEUTE

### Étape 1 : Créer le dossier et les fichiers
1. Créez un nouveau dossier dans `therapeutes/` avec le format `prenom-nom`
   - Exemple : `therapeutes/jean-dupont/`
2. Copiez le fichier d'un thérapeute existant comme modèle :
   - Copiez `therapeutes/sophie-arnault/index.html` dans `therapeutes/jean-dupont/index.html`
3. Ajoutez la photo sous `therapeutes/jean-dupont/photo.webp`

### Étape 2 : Modifier le fichier HTML du nouveau thérapeute
1. Ouvrez `therapeutes/jean-dupont/index.html`
2. Remplacez toutes les informations de Sophie Arnault par celles de Jean Dupont
3. Mettez à jour les `<!-- NOM -->`, `<!-- SPECIALITE -->`, `<!-- TELEPHONE -->`, etc.
4. Mettez à jour le lien de mise à jour en bas : `?therapeute=jean-dupont`

### Étape 3 : Ajouter le thérapeute sur les pages existantes
Modifiez ces 4 fichiers pour ajouter une carte et/ou un lien vers le nouveau thérapeute :
1. `index.html` — Section "Notre équipe" (ajouter une `<article class="team-card">`)
2. `equipe.html` — Grille de l'équipe (ajouter une `<article class="team-card team-card-lg">`)
3. `index.html` — Menu déroulant du header
4. `equipe.html` — Menu déroulant du header
5. Tous les fichiers des thérapeutes — Menu déroulant et footer

### Étape 4 : Mettre à jour le sitemap
Ajoutez l'URL du nouveau thérapeute dans `sitemap.xml`.

---

## 4. SUPPRIMER UN THÉRAPEUTE

1. Supprimez le dossier `therapeutes/prenom-nom/` et tout son contenu
2. Dans `index.html`, supprimez la `<article class="team-card">` correspondante
3. Dans `equipe.html`, supprimez la `<article class="team-card team-card-lg">` correspondante
4. Supprimez les liens dans les menus de navigation (dropdown) de toutes les pages
5. Supprimez la ligne dans les footers
6. Retirez l'URL du `sitemap.xml`

---

## 5. CONFIGURER FORMSPREE (formulaires de contact)

Les formulaires de contact du site utilisent Formspree (service gratuit jusqu'à 50 soumissions/mois).

### Créer un compte Formspree
1. Allez sur https://formspree.io
2. Cliquez sur "Get Started" et créez un compte avec votre email `assoterrehappy1@gmail.com`
3. Vérifiez votre email

### Créer un formulaire
1. Une fois connecté, cliquez sur "New Form"
2. Donnez-lui un nom (ex : "Contact Terre'Happy")
3. Notez l'identifiant fourni (ex : `xpzgkjvb`)

### Intégrer dans le site
1. Dans chaque fichier HTML contenant un formulaire, cherchez :
   ```
   action="https://formspree.io/f/VOTRE_ID_FORMSPREE"
   ```
2. Remplacez `VOTRE_ID_FORMSPREE` par votre identifiant réel
3. Fichiers à modifier :
   - `contact.html`
   - `location-salle.html`
   - `mise-a-jour.html`

### Test du formulaire
1. Remplissez et soumettez le formulaire de contact
2. Vérifiez que vous recevez bien l'email sur `assoterrehappy1@gmail.com`

### Plan gratuit
Le plan gratuit Formspree permet 50 soumissions par mois. Si vous dépassez cette limite, envisagez le plan payant (environ 10€/mois).

---

## 6. ENVOYER LE LIEN DE MISE À JOUR À UN THÉRAPEUTE

### Lien personnalisé
Chaque thérapeute dispose d'un lien unique qui pré-remplit son nom dans le formulaire :

| Thérapeute | Lien à envoyer |
|-----------|----------------|
| Sophie Arnault | `www.terrehappycholet.com/mise-a-jour.html?therapeute=sophie-arnault` |
| Lucie Boussard | `www.terrehappycholet.com/mise-a-jour.html?therapeute=lucie-boussard` |
| Stéphanie Chauvin | `www.terrehappycholet.com/mise-a-jour.html?therapeute=stephanie-chauvin` |
| Alice Delabre | `www.terrehappycholet.com/mise-a-jour.html?therapeute=alice-delabre` |
| Philippe Houssin | `www.terrehappycholet.com/mise-a-jour.html?therapeute=philippe-houssin` |
| Audrey Mhoma-Desorgues | `www.terrehappycholet.com/mise-a-jour.html?therapeute=audrey-mhoma-desorgues` |
| Stéphanie Quartier | `www.terrehappycholet.com/mise-a-jour.html?therapeute=stephanie-quartier` |
| Sophie Raveneau | `www.terrehappycholet.com/mise-a-jour.html?therapeute=sophie-raveneau` |
| Anne Tabakhoff | `www.terrehappycholet.com/mise-a-jour.html?therapeute=anne-tabakhoff` |
| Nancy Giraudeau | `www.terrehappycholet.com/mise-a-jour.html?therapeute=nancy-giraudeau` |

### Email type à envoyer
```
Objet : Mise à jour de votre fiche sur le site Terre'Happy

Bonjour [Prénom],

Tu peux mettre à jour ta fiche sur notre site web en utilisant ce lien :
[COLLER LE LIEN PERSONNALISÉ]

Tu y trouveras un formulaire pour mettre à jour ton texte de présentation,
tes prestations, tes coordonnées, etc.

Pour changer ta photo, envoie-la directement à ce email en réponse.

Merci !
L'équipe Terre'Happy
```

---

## 7. DÉPLOIEMENT DU SITE

### Option A — Netlify (recommandé, gratuit)

1. Créez un compte sur https://www.netlify.com
2. Cliquez sur "Add new site" → "Deploy manually"
3. Glissez-déposez le dossier `site-web/` complet dans la zone de dépôt
4. Netlify génère une URL automatique (ex : `terrehappy-cholet.netlify.app`)
5. Pour un domaine personnalisé : Settings → Domain management → Add domain

**Mise à jour du site :**
- Retournez sur Netlify → Sites → votre site
- Cliquez sur "Deploys" → Glissez à nouveau le dossier mis à jour

### Option B — GitHub Pages (gratuit)

1. Créez un compte GitHub sur https://github.com
2. Créez un nouveau dépôt public nommé `terrehappycholet`
3. Téléversez tous les fichiers du dossier `site-web/`
4. Allez dans Settings → Pages → Source : "Deploy from a branch" → main/root
5. Votre site sera accessible sur `https://VOTRE-UTILISATEUR.github.io/terrehappycholet/`

### Option C — OVH / Hébergeur classique (FTP)

1. Connectez-vous à votre espace client OVH
2. Récupérez les identifiants FTP de votre hébergement
3. Utilisez un client FTP (Filezilla, gratuit) pour vous connecter
4. Téléversez tout le contenu du dossier `site-web/` dans le dossier `www/` ou `public_html/`
5. Le fichier `.htaccess` sera automatiquement pris en compte

**Nom de domaine :**
- Si vous avez commandé un domaine sur OVH, pointez-le vers votre hébergement
- Si vous utilisez Netlify, vous pouvez faire pointer votre domaine OVH vers Netlify (DNS → CNAME)

### Après le déploiement

1. Vérifiez que toutes les pages s'affichent correctement
2. Testez les formulaires de contact
3. Soumettez votre sitemap à Google Search Console : https://search.google.com/search-console
4. Vérifiez l'affichage sur mobile

---

## 8. AJOUTER UNE ACTUALITÉ

1. Ouvrez `actualites.html`
2. Repérez le commentaire `<!-- MODÈLE D'ARTICLE -->`
3. Décommentez le bloc `<article>` (supprimez `<!--` et `-->`)
4. Remplissez le titre, la date, le texte et l'image
5. Si vous avez plusieurs actualités, dupliquez le bloc `<article>`

**Pour une image d'actualité :**
- Déposez l'image dans `assets/images/`
- Référencez-la : `src="assets/images/NOM-DE-VOTRE-IMAGE.webp"`

---

## 9. MODIFIER LE TEXTE D'ACCUEIL

Le texte principal de la page d'accueil se trouve dans `index.html`.

- **Slogan héro** : cherchez `class="hero-tagline"` — texte entre les balises `<h1>`
- **Sous-titre** : cherchez `class="hero-sub"` — paragraphe `<p>`
- **Texte "À propos"** : cherchez `class="about-body"` — paragraphes `<p>` dans cette section
- **Citation orange** : cherchez `class="tagline-quote"` — paragraphe `<p>`

---

## 10. CONTACTS UTILES

| Besoin | Contact |
|--------|---------|
| Modifications du site | Votre développeur web |
| Problèmes d'hébergement | Support de votre hébergeur |
| Formulaires (Formspree) | support@formspree.io |
| Association Terre'Happy | assoterrehappy1@gmail.com |
| Signalement d'erreur sur une fiche | assoterrehappy1@gmail.com |

---

*Document créé lors de la création du site — mars 2025*
*À conserver précieusement !*
