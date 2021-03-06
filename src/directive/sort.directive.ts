/*
 Copyright 2013-2017 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://jhipster.github.io/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { JhiModuleConfig } from '../config';
import { JhiConfigService } from '../config.service';

@Directive({
    selector: '[jhiSort]'
})
export class JhiSortDirective {
    @Input() predicate: string;
    @Input() ascending: boolean;
    @Input() callback: Function;

    @Output() predicateChange: EventEmitter<any> = new EventEmitter();
    @Output() ascendingChange: EventEmitter<any> = new EventEmitter();

    element: any;
    config: JhiModuleConfig;

    constructor(el: ElementRef, configService: JhiConfigService) {
        this.element = el.nativeElement;
        this.config = configService.getConfig();
    }

    sort(field: any) {
        this.resetClasses();
        if (field !== this.predicate) {
            this.ascending = true;
        } else {
            this.ascending = !this.ascending;
        }
        this.predicate = field;
        this.predicateChange.emit(field);
        this.ascendingChange.emit(this.ascending);
        this.callback();
    }

    private resetClasses() {
        const allSvgIcons = this.element.querySelectorAll(this.config.sortIconSelector);
        // path is stored in the 5th icon attribute.
        const svgPath = this.config.sortIcon.definition.icon[4];
        // Use normal loop instead of forEach because IE does not support forEach on NodeList.
        for (let i = 0; i < allSvgIcons.length; i++) {
            const svgElement = allSvgIcons[i];
            const pathElements = svgElement.getElementsByTagName(this.config.sortIconSvgPathSelector);
            if (pathElements && pathElements.length > 0) {
                const pathElement = pathElements.item(0);
                svgElement.setAttribute('data-icon', this.config.sortIconName.substr(3, this.config.sortIconName.length));
                svgElement.setAttribute('class', 'svg-inline--fa fa-w-10 ' + this.config.sortIconName);
                pathElement.setAttribute('d', svgPath);
            }
        }
    }
}
