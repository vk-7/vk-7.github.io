#!/usr/bin/env bash
# Genera proyectos.json con los repos de vk-7 que tienen el tema "portafolio".
# Solo metadatos: nombre, descripción, lenguaje, fecha del último push y visibilidad.
# Los privados van sin enlace. Necesita GH_TOKEN con permiso Metadata (solo lectura).
set -euo pipefail
gh api --paginate "/user/repos?affiliation=owner&per_page=100" | jq -s '
  { proyectos: [ add[]
      | select((.topics // []) | index("portafolio"))
      | { nombre: .name, descripcion: (.description // ""), lenguaje: .language,
          actualizado: .pushed_at, privado: .private }
        + (if .private then {} else { url: .html_url } end) ]
    | sort_by(.actualizado) | reverse }' > proyectos.json
