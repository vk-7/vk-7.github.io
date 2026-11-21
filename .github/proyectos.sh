#!/usr/bin/env bash
# Genera proyectos.json con todos los repos propios de vk-7, menos los de .github/ocultos.txt.
# Si un repo no tiene descripción en GitHub, usa la de .github/descripciones.json.
# Solo metadatos: nombre, descripción, lenguaje, fecha del último push y visibilidad.
# Los privados van sin enlace. Necesita GH_TOKEN con permiso Metadata (solo lectura).
set -euo pipefail
cd "$(dirname "$0")/.."
ocultos=$(jq -R -s 'split("\n") | map(gsub("^\\s+|\\s+$"; "")) | map(select(length > 0 and (startswith("#") | not)))' .github/ocultos.txt)
gh api --paginate "/user/repos?affiliation=owner&per_page=100" | jq -s --argjson ocultos "$ocultos" --slurpfile desc .github/descripciones.json '
  { proyectos: [ add[]
      | select(.fork | not)
      | select(.name as $n | $ocultos | index($n) | not)
      | { nombre: .name,
          descripcion: (if (.description // "") != "" then .description else ($desc[0][.name] // "") end),
          lenguaje: .language,
          actualizado: .pushed_at, privado: .private }
        + (if .private then {} else { url: .html_url } end) ]
    | sort_by(.nombre | ascii_downcase) }' > proyectos.json
