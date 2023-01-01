// Oscar Saharoy 2022


export default `


#define t uTime
#define pi 3.14159

uniform float uTime;
uniform vec2 uResolution;


float saturate( float x ) {

	return clamp( x, 0., 1. );
}


float waves( vec2 p ) {

	return 0.;
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


void mainImage(
		out vec4 fragColor, in vec2 fragCoord ) {

	vec3 light = vec3(0); // vec3( waves( fragCoord / 100. ) );

	float x = ( fragCoord.x - uResolution.x * .5 ) / uResolution.x * 2.;
	float y = ( fragCoord.y - uResolution.y * .5 ) / uResolution.x * 2.;

	x *= 10.;
	y *= 10.;

	light += vec3( 1., 0., 1. ) * 
		saturate( 100.* (
			cos(x) * .5 + .5
		- y ) );

	light += vec3( 0., 1., 1. ) * 
		saturate( 100. * (
			( wave(x) )
		- y ) );

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

