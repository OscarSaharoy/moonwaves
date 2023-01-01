// Oscar Saharoy 2022


export default `


#define t uTime
#define pi 3.14159265359
#define n normalize

uniform float uTime;
uniform vec2 uResolution;


float saturate( float x ) {

	return clamp( x, 0., 1. );
}

float hash( float x ) {

	return fract(sin(x) * 43758.5453123);
}


float wave( float x ) {

	// remap domain
	float rx = mod( x, 2.*pi );
	rx -= 2. * (rx-pi) * step(pi, rx);

	// coefficients from wave.c
	float m = 5.;
	float n = .2;
	float a = 0.947154;
	float b = -0.165649;
	float c = 8.876987;
	float k = -7.711339;

	// wave function
	return a*rx + b*exp(-m*rx) + c*exp(-n*rx) + k;
}

float dwave( float x ) {

	// remap domain
	float rx = mod( x, 2.*pi );
	float drxdx = 1. - step(pi, rx) * 2.;
	rx -= 2. * (rx-pi) * step(pi, rx);

	// coefficients from wave.c
	float m = 5.;
	float n = .2;
	float a = 0.947154;
	float b = -0.165649;
	float c = 8.876987;
	float k = -7.711339;

	// differential of wave function
	return 
		( a + -b*m*exp(-m*rx) + -c*n*exp(-n*rx) )
		* drxdx;
}


float waves( vec2 p ) {

	float r = 1.;

	float f = 1.;
	float a = .1;

	for( float i = 0.; i<10.; ++i ) {

		float o = hash(i) * 10.;
		vec2 d = n(vec2( hash(i+.1), hash(i+.2) ));

		r *= wave( dot(d,p) * f + o + t*hash(i) ) + .5;

		float m = 1.05;

		f = f * m;
		a = a / m;
	}

	return r;
}

vec2 dwaves( vec2 p ) {

	float r = 1.;
	vec2 dr = vec2(0);

	float f = 1.;
	float a = .1;

	// r = prod_i wave(s_i)

	float i = 0.;
	float o = hash(i) * 10.;
	vec2 d = n(vec2( hash(i+.1), hash(i+.2) ));
	float s = dot(d,p) * f + o;

	r *= wave( s ) + .5;
	dr = dwave(s) * d * f;

	for( ; i<10.; ++i ) {

		float o = hash(i) * 10.;
		vec2 d = n(vec2( hash(i+.1), hash(i+.2) ));

		float s = dot(d,p) * f + o - t*(.5+hash(o));
		float wavei = wave(s) + .5;

		// d(fg) = fg' + f'g
		// d(wavei waves) = dwavei waves + wavei dwaves

		dr = dwave(s) * d * f * r + wavei * dr;
		r *= wavei;

		float m = 1.05;

		f = f * m;
		a = a / m;
	}

	return dr;
}

void mainImage(
		out vec4 fragColor, in vec2 fragCoord ) {

	vec3 light = vec3(0); 

	vec2 p = 
		( fragCoord - uResolution * .5 ) 
		/ uResolution.x * 2.;

	/*
	float s = dot(p,vec2(.6,.8)) * 10.;
	float level = 0.1 * wave( s );
	vec2 dlevel = dwave(s) * vec2(.6,.8);

	vec3 ddx = vec3( 1., 0., dlevel.x );
	vec3 ddy = vec3( 0., 1., dlevel.y );
	vec3 normal = cross( ddx, ddy );
	
	light += dot( n(normal), vec3(1./sqrt(3.)) );
	*/

	//light = vec3( waves(p * 10.) );
	vec2 ddxddy = dwaves(p * 10. * vec2(1.,1.));

	vec3 ddx = vec3( 1., 0., ddxddy.x );
	vec3 ddy = vec3( 0., 1., ddxddy.y );
	vec3 normal = n(cross( ddx, ddy ));
	
	light += dot( n(normal), vec3(1./sqrt(3.)) );

	fragColor = vec4( light, 1. );
}


void main() {

    float minDimension = min( uResolution.x, uResolution.y );
    float aspect = uResolution.x / uResolution.y;
    vec2 centredFragCoord = 2. * gl_FragCoord.xy - uResolution.xy;
    vec2 screenPos = centredFragCoord / minDimension;

    mainImage( gl_FragColor, gl_FragCoord.xy );
}

`;

