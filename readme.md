# Prácticas de la Asignatura  de Aplicaciones web 
## Docente:M.T.I Marco A. Ramírez Hernández 
#### Carrera:T.S.U En Desarrollo de Software Multiplataforma
Periodo: Septiembre - Diciembre 2026
---
### Tabla de Prácticas de la Materia

|no.|Nombre|Descripción|Potenciador|Estatus|
|:-|:-|:-|:-:|:-:|
|1. |Metodología de Evaluación de la Materia |Transcribir a libreta y comprender la metodología de evaluación de la asignatura |5 |🟢Concluida|
|2.|Mi Primer Página Web|Codificar la primer págiona web con HTML puro, sin estilos ni funcionalidades|10|🟢 Concluida|
||

### 🌐 GitHub Pages

🔗 https://galeexp.github.io/Practicas-Aplicaciones_Web/

#### Comandos usados

```bash
# Unir la rama a main (con commit de merge)
git checkout main
git pull origin main
git merge --no-ff Practica03 -m "Merge branch 'Practica03'"
git push origin main

# Renombrar la página principal
git mv MiPerfil.html index.html
git commit -m "Renombrar a index.html"
git push origin main

# Eliminar la rama (local y remota)
git branch -d Practica03
git push origin --delete Practica03
```

Activación: **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
