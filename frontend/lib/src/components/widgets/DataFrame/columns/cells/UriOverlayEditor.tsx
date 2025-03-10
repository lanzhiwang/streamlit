/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { SelectionRange, TextCellEntry } from "@glideapps/glide-data-grid"
import React from "react"
import { Edit } from "@emotion-icons/material-rounded"
import Icon from "@streamlit/lib/src/components/shared/Icon"
import { UriOverlayEditorStyle } from "@streamlit/lib/src/components/widgets/DataFrame/columns/cells/uri-overlay-editor-style"

interface Props {
  readonly uri?: string | null
  readonly onChange: (ev: React.ChangeEvent<HTMLTextAreaElement>) => void
  readonly forceEditMode: boolean
  readonly readonly: boolean
  readonly preview: string
  readonly validatedSelection?: SelectionRange
}

// this is essentially just copying the UriOverlayEditor from glide's implementation: https://github.com/glideapps/glide-data-grid/blob/0ea52f371a5e2aaa8595aceefa40722d35410b1a/packages/core/src/data-grid-overlay-editor/private/uri-overlay-editor-style.tsx
// we use it in LinkCell.tsx which is our custom version of the UriCell.
const UriOverlayEditor: React.FunctionComponent<Props> = p => {
  const {
    uri,
    onChange,
    forceEditMode,
    readonly,
    validatedSelection,
    preview,
  } = p

  const [editMode, setEditMode] = React.useState<boolean>(
    !readonly && (!uri || forceEditMode)
  )

  const onEditClick = React.useCallback(() => {
    setEditMode(true)
  }, [])

  if (editMode) {
    return (
      <TextCellEntry
        validatedSelection={validatedSelection}
        highlight={true}
        autoFocus={true}
        value={uri ?? ""}
        onChange={onChange}
      />
    )
  }

  return (
    <UriOverlayEditorStyle>
      <a
        data-testid={"link-cell"}
        className="gdg-link-area"
        href={uri ?? ""}
        target="_blank"
        rel="noopener noreferrer"
      >
        {preview}
      </a>
      {!readonly && (
        <div
          className="gdg-edit-icon"
          data-testid="gdg-edit-icon"
          onClick={onEditClick}
        >
          <Icon content={Edit} size="lg" />
        </div>
      )}
      <textarea className="gdg-input" autoFocus={true} />
    </UriOverlayEditorStyle>
  )
}

export default UriOverlayEditor
