/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { TPromise } from 'vs/base/common/winjs.base';
import { OpenContext, IWindowConfiguration, ReadyState, IPath } from 'vs/platform/windows/common/windows';
import { ParsedArgs } from 'vs/platform/environment/common/environment';
import Event from 'vs/base/common/event';
import { ITelemetryData } from 'vs/platform/telemetry/common/telemetry';
import { createDecorator } from "vs/platform/instantiation/common/instantiation";
import { IProcessEnvironment } from "vs/base/common/platform";

export interface ICodeWindow {
	id: number;
	win: Electron.BrowserWindow;
	config: IWindowConfiguration;
	openedWorkspacePath: string;

	readyState: ReadyState;

	close(): void;

	send(channel: string, ...args: any[]): void;
	sendWhenReady(channel: string, ...args: any[]): void;

	toggleFullScreen(): void;
	hasHiddenTitleBarStyle(): boolean;
	setRepresentedFilename(name: string): void;
	getRepresentedFilename(): string;
	onWindowTitleDoubleClick(): void;
}

export const IWindowsMainService = createDecorator<IWindowsMainService>('windowsMainService');

export interface IWindowsMainService {
	_serviceBrand: any;

	// events
	onWindowReady: Event<ICodeWindow>;
	onWindowClose: Event<number>;
	onWindowReload: Event<number>;
	onPathsOpen: Event<IPath[]>;

	// methods
	ready(initialUserEnv: IProcessEnvironment): void;
	reload(win: ICodeWindow, cli?: ParsedArgs): void;
	open(openConfig: IOpenConfiguration): ICodeWindow[];
	openExtensionDevelopmentHostWindow(openConfig: IOpenConfiguration): void;
	openFileFolderPicker(forceNewWindow?: boolean, data?: ITelemetryData): void;
	openFilePicker(forceNewWindow?: boolean, path?: string, window?: ICodeWindow, data?: ITelemetryData): void;
	openFolderPicker(forceNewWindow?: boolean, window?: ICodeWindow, data?: ITelemetryData): void;
	focusLastActive(cli: ParsedArgs, context: OpenContext): ICodeWindow;
	getLastActiveWindow(): ICodeWindow;
	findWindow(workspacePath: string, filePath?: string, extensionDevelopmentPath?: string): ICodeWindow;
	openNewWindow(context: OpenContext): void;
	sendToFocused(channel: string, ...args: any[]): void;
	sendToAll(channel: string, payload: any, windowIdsToIgnore?: number[]): void;
	getFocusedWindow(): ICodeWindow;
	getWindowById(windowId: number): ICodeWindow;
	getWindows(): ICodeWindow[];
	getWindowCount(): number;
	quit(): void;
}

export interface IOpenConfiguration {
	context: OpenContext;
	cli: ParsedArgs;
	userEnv?: IProcessEnvironment;
	pathsToOpen?: string[];
	preferNewWindow?: boolean;
	forceNewWindow?: boolean;
	forceReuseWindow?: boolean;
	forceEmpty?: boolean;
	windowToUse?: ICodeWindow;
	diffMode?: boolean;
	initialStartup?: boolean;
}

export interface ISharedProcess {
	whenReady(): TPromise<void>;
	toggle(): void;
}