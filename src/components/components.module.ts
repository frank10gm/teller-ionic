import { NgModule } from '@angular/core';
import { PostCardComponent } from './post-card/post-card';
import { IonicModule } from 'ionic-angular';
@NgModule({
	declarations: [PostCardComponent],
	imports: [
		IonicModule
	],
	exports: [PostCardComponent]
})
export class ComponentsModule {}
