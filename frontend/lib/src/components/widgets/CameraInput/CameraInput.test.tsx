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

import React from "react"
import "@testing-library/jest-dom"

import { screen, fireEvent, within } from "@testing-library/react"
import { act } from "react-dom/test-utils"
import { enableFetchMocks } from "jest-fetch-mock"

import { mount, shallow, render } from "@streamlit/lib/src/test_util"
import { WidgetStateManager } from "@streamlit/lib/src/WidgetStateManager"
import {
  CameraInput as CameraInputProto,
  FileURLs as FileURLsProto,
  LabelVisibilityMessage as LabelVisibilityMessageProto,
} from "@streamlit/lib/src/proto"
import { WidgetLabel } from "@streamlit/lib/src/components/widgets/BaseWidget"
import CameraInput, { Props, State } from "./CameraInput"
import { FacingMode } from "./SwitchFacingModeButton"
import WebcamComponent from "./WebcamComponent"
import { StyledBox } from "./styled-components"

jest.mock("react-webcam")

jest.mock("react-device-detect", () => {
  return {
    isMobile: true,
  }
})

const getProps = (elementProps: Partial<CameraInputProto> = {}): Props => {
  return {
    element: CameraInputProto.create({
      id: "id",
      label: "test_label",
      help: "help",
      formId: "",
      ...elementProps,
    }),
    width: 0,
    disabled: false,
    widgetMgr: new WidgetStateManager({
      sendRerunBackMsg: jest.fn(),
      formsDataChanged: jest.fn(),
    }),
    // @ts-expect-error
    uploadClient: {
      uploadFile: jest.fn().mockImplementation(() => {
        return Promise.resolve()
      }),
      fetchFileURLs: jest.fn().mockImplementation((acceptedFiles: File[]) => {
        return Promise.resolve(
          acceptedFiles.map(file => {
            return new FileURLsProto({
              fileId: file.name,
              uploadUrl: file.name,
              deleteUrl: file.name,
            })
          })
        )
      }),
      deleteFile: jest.fn(),
    },
  }
}

describe("CameraInput widget", () => {
  enableFetchMocks()
  it("renders without crashing", () => {
    const props = getProps()
    jest.spyOn(props.widgetMgr, "setFileUploaderStateValue")
    render(<CameraInput {...props} />)

    expect(screen.getByTestId("stCameraInput")).toBeInTheDocument()
    expect(screen.getByText("Take Photo")).toBeInTheDocument()
    // WidgetStateManager should have been called on mounting
    expect(props.widgetMgr.setFileUploaderStateValue).toHaveBeenCalledTimes(1)
  })

  it("shows a label", () => {
    const props = getProps()
    render(<CameraInput {...props} />)
    expect(screen.getByTestId("stWidgetLabel")).toHaveTextContent(
      props.element.label
    )
  })

  it("pass labelVisibility prop to StyledWidgetLabel correctly when hidden", () => {
    const props = getProps({
      labelVisibility: {
        value: LabelVisibilityMessageProto.LabelVisibilityOptions.HIDDEN,
      },
    })
    render(<CameraInput {...props} />)
    expect(screen.getByTestId("stWidgetLabel")).toHaveStyle(
      "visibility: hidden"
    )
  })

  it("pass labelVisibility prop to StyledWidgetLabel correctly when collapsed", () => {
    const props = getProps({
      labelVisibility: {
        value: LabelVisibilityMessageProto.LabelVisibilityOptions.COLLAPSED,
      },
    })
    render(<CameraInput {...props} />)
    expect(screen.getByTestId("stWidgetLabel")).toHaveStyle("display: none")
  })

  // it("shows a SwitchFacingMode button", () => {
  //   const props = getProps()
  //   const wrapper = mount(<CameraInput {...props} />)

  //   act(() => {
  //     wrapper
  //       .find("Webcam")
  //       .props()
  //       // @ts-expect-error
  //       .onUserMedia(null)
  //   })

  //   wrapper.update()

  //   expect(wrapper.find("SwitchFacingModeButton").exists()).toBeTruthy()
  // })

  // it("changes `facingMode` when SwitchFacingMode button clicked", () => {
  //   const props = getProps()
  //   const wrapper = mount<CameraInput, Props, State>(
  //     <CameraInput {...props} />
  //   )

  //   act(() => {
  //     wrapper
  //       .find("Webcam")
  //       .props()
  //       // @ts-expect-error
  //       .onUserMedia(null)
  //   })

  //   wrapper.update()

  //   act(() => {
  //     wrapper.find("SwitchFacingModeButton").find("button").simulate("click")
  //   })
  //   wrapper.update()

  //   expect(wrapper.instance().state.facingMode).toBe(FacingMode.ENVIRONMENT)
  // })

  // it("test handle capture function", async () => {
  //   const props = getProps()
  //   render(<CameraInput {...props} />)

  // const wrapper = shallow<CameraInput, Props, State>(
  //   <CameraInput {...props} />
  // )
  // // @ts-expect-error
  // await wrapper.instance().handleCapture("test img")

  // expect(wrapper.instance().state.files).toHaveLength(1)
  // expect(wrapper.instance().state.files[0].name).toContain("camera-input-")
  // expect(wrapper.instance().state.shutter).toBe(false)
  // expect(wrapper.instance().state.minShutterEffectPassed).toBe(true)

  // expect(wrapper.find(StyledBox)).toHaveLength(1)
  // expect(wrapper.find(WebcamComponent)).toHaveLength(0)
  // })

  // it("test remove capture", async () => {
  //   const props = getProps()
  //   const wrapper = shallow<CameraInput, Props, State>(
  //     <CameraInput {...props} />
  //   )
  //   // @ts-expect-error
  //   await wrapper.instance().handleCapture("test img")

  //   // @ts-expect-error
  //   await wrapper.instance().removeCapture()
  //   expect(wrapper.state()).toEqual({
  //     files: [],
  //     clearPhotoInProgress: true,
  //     facingMode: FacingMode.USER,
  //     imgSrc: null,
  //     shutter: false,
  //     minShutterEffectPassed: true,
  //   })
  // })
})
